'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/cn'
import { X, Plus, Upload } from 'lucide-react'
import { Service } from '@/lib/types'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  onWallpaperUpload: (file: File) => Promise<void>
  onAddService: (data: {
    name: string
    url: string
    type: 'atlassian' | 'downdetector'
    api_url?: string
    logo_domain?: string
    description?: string
  }) => Promise<void>
  onDeleteService?: (id: string) => Promise<void>
  services?: Service[]
  wallpaperImage?: string
}

export function SettingsModal({
  open,
  onClose,
  onWallpaperUpload,
  onAddService,
  onDeleteService,
  services = [],
  wallpaperImage,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'add' | 'manage'>('wallpaper')
  const [serviceType, setServiceType] = useState<'atlassian' | 'downdetector'>('atlassian')
  const [serviceName, setServiceName] = useState('')
  const [serviceDescription, setServiceDescription] = useState('')
  const [serviceUrl, setServiceUrl] = useState('')
  const [serviceApiUrl, setServiceApiUrl] = useState('')
  const [logoDomain, setLogoDomain] = useState('')
  const [uploading, setUploading] = useState(false)
  const [addingService, setAddingService] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleWallpaperChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      try { await onWallpaperUpload(file) } finally { setUploading(false) }
    }
  }

  const handleAddService = async () => {
    setError('')
    setSuccess('')
    if (!serviceName.trim()) { setError('Service name is required'); return }
    if (!serviceUrl.trim()) { setError('Status URL is required'); return }
    if (serviceType === 'atlassian' && !serviceApiUrl.trim()) {
      setError('API URL is required for Atlassian services'); return
    }
    setAddingService(true)
    try {
      await onAddService({
        name: serviceName.trim(),
        url: serviceUrl.trim(),
        type: serviceType,
        api_url: serviceApiUrl.trim() || undefined,
        logo_domain: logoDomain.trim() || undefined,
        description: serviceDescription.trim() || undefined,
      })
      setServiceName('')
      setServiceDescription('')
      setServiceUrl('')
      setServiceApiUrl('')
      setLogoDomain('')
      setSuccess(`${serviceName} added successfully!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to add service')
    } finally {
      setAddingService(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700/30 bg-slate-900/70">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            {(['wallpaper', 'add', 'manage'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors text-sm',
                  activeTab === tab ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                )}
              >
                {tab === 'wallpaper' ? 'Wallpaper' : tab === 'add' ? 'Add Service' : 'Manage'}
              </button>
            ))}
          </div>

          {activeTab === 'wallpaper' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Upload Wallpaper</h3>
              {wallpaperImage && (
                <div className="mb-4 rounded-lg overflow-hidden border border-slate-700/50">
                  <img src={wallpaperImage} alt="Current wallpaper" className="w-full h-48 object-cover" />
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-medium transition-colors"
              >
                <Upload size={18} />
                {uploading ? 'Uploading...' : 'Choose Image'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleWallpaperChange} className="hidden" />
            </div>
          )}

          {activeTab === 'add' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Add Service</h3>
              <p className="text-sm text-slate-400">Choose the type of status page the service uses:</p>

              <div className="flex gap-2">
                <button
                  onClick={() => setServiceType('atlassian')}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border',
                    serviceType === 'atlassian'
                      ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  )}
                >
                  Atlassian Statuspage
                </button>
                <button
                  onClick={() => setServiceType('downdetector')}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border',
                    serviceType === 'downdetector'
                      ? 'bg-orange-600/20 border-orange-500/50 text-orange-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  )}
                >
                  DownDetector
                </button>
              </div>

              {serviceType === 'atlassian' ? (
                <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold text-purple-300 mb-1">Atlassian Statuspage</div>
                  <p>Used by: GitHub, Cloudflare, Vercel, Notion, Stripe, Zoom, Datadog, etc.</p>
                  <p><span className="text-slate-300">Status URL:</span> e.g. <code className="text-slate-200">https://status.teamviewer.com</code></p>
                  <p><span className="text-slate-300">API URL:</span> must end in <code className="text-slate-200">/api/v2/status.json</code></p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold text-orange-300 mb-1">DownDetector</div>
                  <p>Used for ISPs, banks, telcos (Telia, Telenor, Netflix, etc.) without their own status page.</p>
                  <p><span className="text-slate-300">URL:</span> e.g. <code className="text-slate-200">https://downdetector.no/feil-problem/telia/</code></p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Service Name *</label>
                <input type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. TeamViewer"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description (optional)</label>
                <input type="text" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="e.g. Remote access & support"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {serviceType === 'atlassian' ? 'Status URL *' : 'DownDetector URL *'}
                </label>
                <input type="url" value={serviceUrl} onChange={(e) => setServiceUrl(e.target.value)}
                  placeholder={serviceType === 'atlassian' ? 'https://status.teamviewer.com' : 'https://downdetector.no/feil-problem/telia/'}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm" />
              </div>

              {serviceType === 'atlassian' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">API URL *</label>
                  <input type="url" value={serviceApiUrl} onChange={(e) => setServiceApiUrl(e.target.value)}
                    placeholder="https://status.teamviewer.com/api/v2/status.json"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Logo Domain (optional)</label>
                <input type="text" value={logoDomain} onChange={(e) => setLogoDomain(e.target.value)}
                  placeholder="e.g. teamviewer.com"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm" />
              </div>

              {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
              {success && <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">{success}</p>}

              <button onClick={handleAddService} disabled={addingService}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-medium transition-colors">
                <Plus size={18} />
                {addingService ? 'Adding...' : 'Add Service'}
              </button>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white mb-2">Manage Services</h3>
              <p className="text-sm text-slate-400">{services.length} service{services.length !== 1 ? 's' : ''}</p>
              {services.length === 0 ? (
                <p className="text-slate-500 text-sm">No services added yet.</p>
              ) : (
                services.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-slate-800/60 rounded-lg border border-slate-700/40">
                    <div>
                      <p className="text-white text-sm font-medium">{s.name}</p>
                      <p className="text-slate-400 text-xs truncate max-w-[260px]">{s.url}</p>
                    </div>
                    {onDeleteService && (
                      <button onClick={() => onDeleteService(s.id)}
                        className="ml-3 px-3 py-1 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                        Delete
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
