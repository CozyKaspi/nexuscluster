import { auth } from '@clerk/nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ServiceStatus } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serviceId } = await request.json()

    if (!serviceId) {
      return NextResponse.json({ error: 'Missing serviceId' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: service, error: fetchError } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !service) {
      console.error('[v0] Service not found:', fetchError)
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    let status: ServiceStatus = 'unknown'

    try {
      if (service.status_type === 'atlassian') {
        // Fetch from Atlassian Statuspage API
        const response = await fetch(service.api_url, { cache: 'no-store' })
        if (!response.ok) throw new Error('API call failed')

        const data = await response.json()

        // Check if any component is not operational
        if (data.components) {
          const hasOutage = data.components.some(
            (c: any) => c.status !== 'operational' && c.status !== 'resolved'
          )
          const hasDegraded = data.components.some(
            (c: any) => c.status === 'degraded_performance' || c.status === 'partial_outage'
          )

          if (hasOutage) {
            status = 'outage'
          } else if (hasDegraded) {
            status = 'degraded'
          } else {
            status = 'operational'
          }
        }

        // Also check the page status as a fallback
        if (data.status?.indicator === 'critical') {
          status = 'outage'
        } else if (data.status?.indicator === 'major') {
          status = 'degraded'
        } else if (data.status?.indicator === 'minor') {
          status = 'degraded'
        } else if (data.status?.indicator === 'none') {
          status = 'operational'
        }
      }
    } catch (error) {
      console.error('[v0] Status check error:', error)
      status = 'unknown'
    }

    // Update the service with new status
    const { error: updateError } = await supabase
      .from('services')
      .update({ status, last_checked: new Date().toISOString() })
      .eq('id', serviceId)

    if (updateError) {
      console.error('[v0] Update error:', updateError)
    }

    return NextResponse.json({ status, serviceId })
  } catch (error) {
    console.error('[v0] Status check error:', error)
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 })
  }
}
