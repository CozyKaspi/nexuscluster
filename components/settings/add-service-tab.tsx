'use client'

import { useState } from 'react'
import { type StatusType } from '@/lib/types'

interface AddServiceTabProps {
  onSuccess: () => void
}

const ATLASSIAN_INFO = {
  title: 'ATLASSIAN STATUSPAGE FORMAT',
  description: 'Used by: GitHub, Cloudflare, Stripe, Zoom, Vercel, Notion, Atlassian, Twilio, TeamViewer, PagerDuty, Datadog, HubSpot, and many more.',
  fields: [
    { label: 'Status URL', example: 'https://status.teamviewer.com', description: 'the page users visit, e.g.' },
    { label: 'API URL', example: 'https://status.teamviewer.com/api/v2/status.json', description: 'must end in /api/v2/status.json' },
    { label: 'Logo Domain', example: 'teamviewer.com', description: 'root domain used to auto-fetch the logo, e.g.' },
  ],
}

export default function AddServiceTab({ onSuccess }: AddServiceTabProps) {
  const [statusType, setStatusType] = useState<StatusType>('atlassian')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [statusUrl, setStatusUrl] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [logoDomain, setLogoDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: description || null,
          status_url: statusUrl,
          api_url: apiUrl,
          logo_domain: logoDomain || null,
          status_type: statusType,
        }),
      })

      if (response.ok) {
        setName('')
        setDescription('')
        setStatusUrl('')
        setApiUrl('')
        setLogoDomain('')
        onSuccess()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to add service')
      }
    } catch (err) {
      console.error('[v0] Add service error:', err)
      setError('Failed to add service')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Add a Service</h3>
        <p className="text-slate-400">Choose the type of status page the service uses:</p>
      </div>

      {/* Status Type Selection */}
      <div className="flex gap-4">
        <button
          onClick={() => setStatusType('atlassian')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            statusType === 'atlassian'
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Atlassian Statuspage
        </button>
        <button
          onClick={() => setStatusType('downdetector')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            statusType === 'downdetector'
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          DownDetector
        </button>
      </div>

      {/* Info Box */}
      {statusType === 'atlassian' && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3">
          <h4 className="font-bold text-cyan-400 uppercase text-sm tracking-wide">
            {ATLASSIAN_INFO.title}
          </h4>
          <p className="text-slate-300 text-sm">{ATLASSIAN_INFO.description}</p>
          <div className="space-y-2 mt-4 pt-4 border-t border-slate-700">
            {ATLASSIAN_INFO.fields.map((field) => (
              <div key={field.label} className="text-sm">
                <p className="text-slate-200 font-medium">
                  {field.label} <span className="text-slate-500">— {field.description}</span>
                </p>
                <p className="text-cyan-400 font-mono mt-1">{field.example}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Service Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Telia"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Norwegian mobile & broadband"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Status URL *</label>
          <input
            type="url"
            value={statusUrl}
            onChange={(e) => setStatusUrl(e.target.value)}
            placeholder="https://status.teamviewer.com"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">API URL *</label>
          <input
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://status.teamviewer.com/api/v2/status.json"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Logo Domain (optional)</label>
          <input
            type="text"
            value={logoDomain}
            onChange={(e) => setLogoDomain(e.target.value)}
            placeholder="e.g. telia.no"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || !name || !statusUrl || !apiUrl}
          className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 text-white rounded-lg font-medium transition-colors"
        >
          {loading ? 'Adding Service...' : 'Add Service'}
        </button>
      </form>
    </div>
  )
}
