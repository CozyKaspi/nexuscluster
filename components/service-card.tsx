'use client'

import { Service, STATUS_CONFIG } from '@/lib/types'
import { cn } from '@/lib/cn'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const statusConfig = STATUS_CONFIG[service.status] || STATUS_CONFIG.unknown

  const handleClick = () => {
    window.open(service.status_url, '_blank')
  }

  const getStatusStyles = () => {
    switch (service.status) {
      case 'operational':
        return {
          border: 'border-emerald-500/20 hover:border-emerald-500/40',
          bg: 'bg-emerald-500/5 hover:bg-emerald-500/10',
          glow: 'bg-emerald-500',
          dot: 'bg-emerald-500',
          text: 'text-emerald-400',
        }
      case 'degraded':
        return {
          border: 'border-amber-500/20 hover:border-amber-500/40',
          bg: 'bg-amber-500/5 hover:bg-amber-500/10',
          glow: 'bg-amber-500',
          dot: 'bg-amber-500',
          text: 'text-amber-400',
        }
      case 'outage':
        return {
          border: 'border-red-500/20 hover:border-red-500/40',
          bg: 'bg-red-500/5 hover:bg-red-500/10',
          glow: 'bg-red-500',
          dot: 'bg-red-500',
          text: 'text-red-400',
        }
      default:
        return {
          border: 'border-slate-500/20 hover:border-slate-500/40',
          bg: 'bg-slate-500/5 hover:bg-slate-500/10',
          glow: 'bg-slate-500',
          dot: 'bg-slate-500',
          text: 'text-slate-400',
        }
    }
  }

  const styles = getStatusStyles()

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group relative overflow-hidden rounded-lg border backdrop-blur-xl transition-all duration-300 text-left w-full cursor-pointer',
        styles.border,
        styles.bg
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn('absolute h-40 w-40 rounded-full opacity-20', styles.glow)}
          style={{
            top: '-50%',
            right: '-50%',
          }}
        />
      </div>

      <div className="relative p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-1">{service.name}</h3>
          {service.description && (
            <p className="text-sm text-slate-400">{service.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className={cn('h-3 w-3 rounded-full animate-pulse', styles.dot)} />
          <span className={cn('text-sm font-medium', styles.text)}>
            {statusConfig.label}
          </span>
        </div>
      </div>
    </button>
  )
}
