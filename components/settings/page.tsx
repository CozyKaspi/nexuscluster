'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { ServiceCard } from '@/components/service-card'
import { SettingsModal } from '@/components/settings-modal'
import { Service } from '@/lib/types'

export default function Dashboard() {
  const { user, isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [wallpaperImage, setWallpaperImage] = useState<string | undefined>()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/auth/login')
  }, [isLoaded, isSignedIn, router])

  const checkStatus = useCallback(async (service: Service): Promise<Service> => {
    try {
      const params = new URLSearchParams({
        type: service.type || 'atlassian',
        url: service.url,
        ...(service.api_url ? { apiUrl: service.api_url } : {}),
      })
      const res = await fetch(`/api/check-status?${params}`)
      if (res.ok) {
        const { status } = await res.json()
        return { ...service, status }
      }
    } catch {}
    return { ...service, status: 'unknown' }
  }, [])

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const { services: raw } = await response.json()
        // Show services immediately as unknown, then update statuses
        const withUnknown = (raw as Service[]).map((s) => ({ ...s, status: 'unknown' as const }))
        setServices(withUnknown)
        setLoading(false)
        // Check all statuses in parallel
        const checked = await Promise.all(withUnknown.map(checkStatus))
        setServices(checked)
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }, [checkStatus])

  useEffect(() => {
    if (isSignedIn && user) {
      fetchServices()
      // Refresh statuses every 60 seconds
      const interval = setInterval(fetchServices, 60_000)
      return () => clearInterval(interval)
    }
  }, [isSignedIn, user, fetchServices])

  const handleWallpaperUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData })
      if (response.ok) {
        const { pathname } = await response.json()
        setWallpaperImage(`/api/wallpaper?pathname=${encodeURIComponent(pathname)}`)
      }
    } catch (error) {
      console.error('Failed to upload wallpaper:', error)
    }
  }

  const handleAddService = async (data: {
    name: string
    url: string
    type: 'atlassian' | 'downdetector'
    api_url?: string
    logo_domain?: string
    description?: string
  }) => {
    const response = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const { service } = await response.json()
      const newService: Service = { ...service, status: 'unknown' as const }
      setServices((prev) => [...prev, newService])
      // Check its status right away
      const checked = await checkStatus(newService)
      setServices((prev) => prev.map((s) => (s.id === checked.id ? checked : s)))
    }
  }

  const handleDeleteService = async (id: string) => {
    const response = await fetch('/api/services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (response.ok) setServices((prev) => prev.filter((s) => s.id !== id))
  }

  if (!isLoaded || !isSignedIn) return null

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950"
      style={{
        backgroundImage: wallpaperImage
          ? `linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(88, 28, 135, 0.85)), url('${wallpaperImage}')`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="relative min-h-screen">
        <header className="border-b border-slate-700/30 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">NC</span>
              </div>
              <h1 className="text-2xl font-bold text-white">NexusCluster</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Open settings"
              >
                <Settings size={20} />
              </button>
              <UserButton appearance={{ elements: { avatarBox: 'w-10 h-10' } }} />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user?.firstName}! 👋
            </h2>
            <p className="text-slate-400">Monitor all your services in one place</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-400">Loading services...</div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">No services added yet</p>
              <button
                onClick={() => setSettingsOpen(true)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Your First Service
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} onDelete={handleDeleteService} />
              ))}
            </div>
          )}
        </main>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onWallpaperUpload={handleWallpaperUpload}
        onAddService={handleAddService}
        onDeleteService={handleDeleteService}
        services={services}
        wallpaperImage={wallpaperImage}
      />
    </div>
  )
}
