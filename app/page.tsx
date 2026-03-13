'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Settings, LogOut } from 'lucide-react'
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
    if (isLoaded && !isSignedIn) {
      router.push('/auth/login')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (isSignedIn && user) {
      fetchServices()
      fetchWallpaper()
    }
  }, [isSignedIn, user])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const { services } = await response.json()
        setServices(services)
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWallpaper = async () => {
    try {
      const response = await fetch('/api/user-settings')
      if (response.ok) {
        const { settings } = await response.json()
        if (settings?.wallpaper_url) {
          setWallpaperImage(`/api/wallpaper?pathname=${encodeURIComponent(settings.wallpaper_url)}`)
        }
      }
    } catch (error) {
      console.error('Failed to fetch wallpaper:', error)
    }
  }

  const handleWallpaperUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { pathname } = await response.json()
        setWallpaperImage(`/api/wallpaper?pathname=${encodeURIComponent(pathname)}`)
      }
    } catch (error) {
      console.error('Failed to upload wallpaper:', error)
    }
  }

  const handleAddService = async (name: string, url: string) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url }),
      })

      if (response.ok) {
        const { service } = await response.json()
        setServices([...services, service])
      }
    } catch (error) {
      console.error('Failed to add service:', error)
    }
  }

  const handleDeleteService = async (id: string) => {
    try {
      const response = await fetch('/api/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setServices(services.filter((s) => s.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete service:', error)
    }
  }

  if (!isLoaded || !isSignedIn) {
    return null
  }

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
        {/* Header */}
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
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10',
                  },
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.firstName}! 👋</h2>
            <p className="text-slate-400">Monitor all your services in one place</p>
          </div>

          {/* Services Grid */}
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
                <ServiceCard
                  key={service.id}
                  service={service}
                  onDelete={handleDeleteService}
                />
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
        wallpaperImage={wallpaperImage}
      />
    </div>
  )
}
