import { type NextRequest, NextResponse } from 'next/server'

// Atlassian Statuspage: fetch /api/v2/status.json and read indicator
async function checkAtlassian(apiUrl: string): Promise<string> {
  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return 'unknown'
    const data = await res.json()
    const indicator = data?.status?.indicator
    if (indicator === undefined) return 'unknown'
    if (indicator === 'none') return 'operational'
    if (indicator === 'minor') return 'degraded'
    return 'outage'
  } catch {
    return 'unknown'
  }
}

// DownDetector: parse embedded JSON from page HTML
async function checkDowndetector(pageUrl: string): Promise<string> {
  try {
    const res = await fetch(pageUrl, {
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })
    if (!res.ok) return 'unknown'
    const html = await res.text()

    // Strategy 1: explicit status field in embedded JSON
    const statusMatch = html.match(/"status"\s*:\s*"(ok|warn|danger)"/i)
    if (statusMatch) {
      const s = statusMatch[1].toLowerCase()
      return s === 'ok' ? 'operational' : 'outage'
    }

    // Strategy 2: reports vs baseline
    const reportsMatch = html.match(/"reports"\s*:\s*(\[[^\]]+\])/)
    const baselineMatch = html.match(/"baseline"\s*:\s*(\[[^\]]+\])/)
    if (reportsMatch && baselineMatch) {
      const reports = JSON.parse(reportsMatch[1]) as { value?: number }[]
      const baseline = JSON.parse(baselineMatch[1]) as { value?: number }[]
      const recentReports =
        reports.slice(-3).reduce((a, b) => a + (b.value || 0), 0) / 3
      const avg = (arr: { value?: number }[]) =>
        arr.reduce((a, b) => a + (b.value || 0), 0) / (arr.length || 1)
      const normalBaseline = avg(baseline)
      const threshold = Math.max(normalBaseline * 3, 5)
      return recentReports > threshold ? 'outage' : 'operational'
    }

    // Strategy 3: text patterns
    const lc = html.toLowerCase()
    const okPhrases = [
      'no problems', 'ingen problemer', 'ingen rapporterte',
      'fungerer normalt', 'keine störungen', 'keine probleme',
      'status-success', 'status-ok', 'signal-green',
    ]
    const downPhrases = [
      'problems detected', 'problemer registrert', 'mulige problemer',
      'possible problems', 'user reports indicate problems',
      'status-danger', 'status-warn', 'signal-red', 'signal-yellow',
    ]
    const hasOk = okPhrases.some((p) => lc.includes(p))
    const hasDown = downPhrases.some((p) => lc.includes(p))
    if (hasDown && !hasOk) return 'outage'
    if (hasOk && !hasDown) return 'operational'

    return 'unknown'
  } catch {
    return 'unknown'
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'atlassian'
  const apiUrl = searchParams.get('apiUrl')
  const url = searchParams.get('url')

  if (!url && !apiUrl) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 })
  }

  let status: string

  if (type === 'downdetector' && url) {
    status = await checkDowndetector(url)
  } else {
    // Atlassian: use explicit apiUrl, or try appending /api/v2/status.json to the status page URL
    const endpoint =
      apiUrl ||
      (url
        ? url.replace(/\/$/, '') + '/api/v2/status.json'
        : null)
    if (!endpoint) {
      return NextResponse.json({ status: 'unknown' })
    }
    status = await checkAtlassian(endpoint)
  }

  return NextResponse.json({ status })
}
