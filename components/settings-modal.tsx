'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/cn'
import { X, Plus, Upload } from 'lucide-react'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  onWallpaperUpload: (file: File) => Promise<void>
  onAddService: (name: string, url: string) => Promise<void>
  wallpaperImage?: string
}

export function SettingsModal({
  open,
  onClose,
  onWallpaperUpload,
  onAddService,
  wallpaperImage,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'services'>('wallpaper')
  const [serviceName, setServiceName] = useState('')
  const [serviceUrl, setServiceUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [addingService, setAddingService] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleWallpaperChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      try {
        await onWallpaperUpload(file)
      } finally {
        setUploading(false)
      }
    }
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (serviceName && serviceUrl) {
      setAddingService(true)
      try {
        await onAddService(serviceName, serviceUrl)
        setServiceName('')
        setServiceUrl('')
      } finally {
        setAddingService(false)
      }
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700/30 bg-slate-900/50">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('wallpaper')}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === 'wallpaper'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              )}
            >
              Wallpaper
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === 'services'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              )}
            >
              Services
            </button>
          </div>

          {activeTab === 'wallpaper' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Upload Wallpaper</h3>
                {wallpaperImage && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-slate-700/50">
                    <img
                      src={wallpaperImage}
                      alt="Current wallpaper"
                      className="w-full h-48 object-cover"
                    />
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleWallpaperChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Add Service</h3>
              <form onSubmit={handleAddService} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g., GitHub"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Service URL
                  </label>
                  <input
                    type="url"
                    value={serviceUrl}
                    onChange={(e) => setServiceUrl(e.target.value)}
                    placeholder="e.g., https://github.com"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={addingService || !serviceName || !serviceUrl}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus size={18} />
                  {addingService ? 'Adding...' : 'Add Service'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
