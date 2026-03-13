'use client'

import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'

interface BackgroundTabProps {
  wallpaperImage?: string
}

export default function BackgroundTab({ wallpaperImage }: BackgroundTabProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { pathname } = await response.json()
        // Reload or trigger refresh
        window.location.reload()
      } else {
        alert('Failed to upload wallpaper')
      }
    } catch (error) {
      console.error('[v0] Upload error:', error)
      alert('Failed to upload wallpaper')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Background Image</h3>
        <p className="text-slate-400">Upload any image to use as your wallpaper.</p>
      </div>

      <div className="rounded-xl border-2 border-dashed border-slate-600 p-12 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
            <Upload size={32} className="text-slate-400" />
          </div>
        </div>
        <div>
          <p className="text-slate-300 font-medium">Drop an image here or browse</p>
          <p className="text-sm text-slate-500">PNG, JPG, WEBP, GIF - Any resolution</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-block px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 text-white rounded-lg font-medium transition-colors"
        >
          {uploading ? 'Uploading...' : 'Browse'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {wallpaperImage && (
        <div>
          <p className="text-sm text-slate-400 mb-3">Current background:</p>
          <img src={wallpaperImage} alt="Current wallpaper" className="rounded-lg max-h-48 w-full object-cover" />
        </div>
      )}
    </div>
  )
}
