'use client'

import { Service } from '@/lib/types'
import { cn } from '@/lib/cn'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ServiceCardProps {
  service: Service
  onDelete: (id: string) => Promise<void>
}

export function ServiceCard({ service, onDelete }: ServiceCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm(`Delete ${service.name}?`)) {
      setIsDeleting(true)
      try {
        await onDelete(service.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border backdrop-blur-xl transition-all duration-300',
        service.is_online
          ? 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10'
          : 'border-red-500/20 bg-red-500/5 hover:border-red-500/40 hover:bg-red-500/10'
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            'absolute h-40 w-40 rounded-full opacity-20',
            service.is_online ? 'bg-emerald-500' : 'bg-red-500'
          )}
          style={{
            top: '-50%',
            right: '-50%',
          }}
        />
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{service.name}</h3>
            <p className="text-sm text-slate-400 truncate">{service.url}</p>
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="ml-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/10 hover:bg-red-500/20 text-red-400 disabled:opacity-50"
            aria-label="Delete service"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              'h-3 w-3 rounded-full animate-pulse',
              service.is_online ? 'bg-emerald-500' : 'bg-red-500'
            )}
          />
          <span className={cn('text-sm font-medium', service.is_online ? 'text-emerald-400' : 'text-red-400')}>
            {service.is_online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  )
}
