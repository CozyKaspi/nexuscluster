'use client'

import { useState } from 'react'
import { Service } from '@/lib/types'
import { cn } from '@/lib/cn'
import { X, ImageIcon, Plus, Menu3 } from 'lucide-react'
import BackgroundTab from './settings/background-tab'
import AddServiceTab from './settings/add-service-tab'
import ManageServicesTab from './settings/manage-services-tab'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  services: Service[]
  onServicesChange: () => void
  wallpaperImage?: string
}

export function SettingsModal({
  open,
  onClose,
  services,
  onServicesChange,
  wallpaperImage,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'background' | 'add' | 'manage'>('background')

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="h-[90vh] w-full max-w-6xl rounded-2xl border border-slate-700/50 bg-slate-900/90 backdrop-blur-xl flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-slate-700/50 bg-slate-900/50 p-6 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Settings</h2>

          {/* Background Tab */}
          <button
            onClick={() => setActiveTab('background')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left',
              activeTab === 'background'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            )}
          >
            <ImageIcon size={20} className="flex-shrink-0" />
            <span>Background</span>
          </button>

          {/* Add Service Tab */}
          <button
            onClick={() => setActiveTab('add')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left',
              activeTab === 'add'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            )}
          >
            <Plus size={20} className="flex-shrink-0" />
            <span>Add Service</span>
          </button>

          {/* Manage Services Tab */}
          <button
            onClick={() => setActiveTab('manage')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left',
              activeTab === 'manage'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            )}
          >
            <Menu3 size={20} className="flex-shrink-0" />
            <span>Manage</span>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-auto relative">
          <div className="p-8">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="pr-12">
              {activeTab === 'background' && <BackgroundTab wallpaperImage={wallpaperImage} />}
              {activeTab === 'add' && <AddServiceTab onSuccess={onServicesChange} />}
              {activeTab === 'manage' && <ManageServicesTab services={services} onSuccess={onServicesChange} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
