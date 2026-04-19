'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { 
  FiSearch, 
  FiLoader, 
  FiVideo, 
  FiClock, 
  FiList, 
  FiPlayCircle, 
  FiTrash2, 
  FiLayers,
  FiAlertTriangle,
  FiX
} from 'react-icons/fi'

interface Scene { sceneNumber: number; timeRange: string; visual: string; script: string }
interface Generation {
  _id: string
  videoType: string
  topic: string
  keywords: string[]
  tone: string
  duration: string
  audience?: string
  createdAt: string
  output: { title: string; fullScript: string; scenes: Scene[] }
}

interface GroupedGeneration {
  id: string
  topic: string
  videoType: string
  createdAt: string
  versions: Generation[]
}

const TYPE_BADGE: Record<string, string> = {
  marketing: 'bg-secondary-container text-on-secondary-container',
  educational: 'bg-[#1e293b] text-[#94a3b8] border border-[#334155]',
  social_media: 'bg-[#3b2e1e] text-yellow-400 border border-[#713f12]',
  explainer: 'bg-primary-container/20 text-primary-fixed-dim border border-primary/20',
}

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

export default function HistoryPage() {
  const router = useRouter()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activeVersions, setActiveVersions] = useState<Record<string, number>>({})
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/history')
      setGenerations(data.generations)
    } catch {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const openDeleteModal = (id: string) => {
    setPendingDeleteId(id)
    setIsModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDeleteId) return
    setDeletingId(pendingDeleteId)
    setIsModalOpen(false)
    try {
      await api.delete(`/history/${pendingDeleteId}`)
      setGenerations((prev) => prev.filter((g) => g._id !== pendingDeleteId))
      toast.success('Script deleted forever')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeletingId(null)
      setPendingDeleteId(null)
    }
  }

  const handlePreview = (group: GroupedGeneration) => {
    localStorage.setItem('previewVersions', JSON.stringify(group.versions))
    router.push('/dashboard')
  }

  const getGroupedData = () => {
    const sorted = [...generations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const groups: GroupedGeneration[] = []

    sorted.forEach((gen) => {
      const group = groups.find(g => 
        g.topic === gen.topic && 
        Math.abs(new Date(g.createdAt).getTime() - new Date(gen.createdAt).getTime()) < 60000
      )

      if (group) {
        group.versions.push(gen)
      } else {
        groups.push({
          id: gen._id,
          topic: gen.topic,
          videoType: gen.videoType,
          createdAt: gen.createdAt,
          versions: [gen]
        })
      }
    })

    return groups.filter((g) => {
      const matchType = filterType === 'all' || g.videoType === filterType
      const matchSearch = g.topic.toLowerCase().includes(search.toLowerCase()) || 
                          g.versions.some(v => v.output.title.toLowerCase().includes(search.toLowerCase()))
      return matchType && matchSearch
    })
  }

  const groupedData = getGroupedData()

  return (
    <main className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-[-0.04em] text-on-surface mb-1">Generation History</h1>
          <p className="text-on-surface-variant text-sm">Manage your multi-version video scripts.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl" />
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search history..."
                className="bg-surface-container-high text-on-surface border border-outline-variant/15 rounded-xl pl-10 pr-4 py-2.5 text-sm w-56 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select
              value={filterType} onChange={(e) => setFilterType(e.target.value)}
              className="bg-surface-container-high text-on-surface border border-outline-variant/15 rounded-xl px-3 py-2.5 text-sm appearance-none outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="marketing">Marketing</option>
              <option value="educational">Educational</option>
              <option value="social_media">Social Media</option>
              <option value="explainer">Explainer</option>
            </select>
          </div>
          <div className="text-sm text-on-surface-variant font-medium">
            {loading ? 'Loading...' : `${groupedData.length} total projects`}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><FiLoader className="text-primary text-4xl animate-spin" /></div>
        ) : groupedData.length === 0 ? (
          <div className="text-center py-20">
            <FiVideo className="text-on-surface-variant text-6xl block mx-auto mb-4" />
            <p className="text-on-surface-variant text-lg font-medium">No generations found</p>
            <button onClick={() => router.push('/dashboard')} className="mt-6 bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-2.5 px-6 rounded-xl text-sm shadow-lg hover:opacity-90 transition-opacity">Create New Video</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groupedData.map((group) => {
              const vIdx = activeVersions[group.id] || 0
              const currentGen = group.versions[vIdx]
              const badgeClass = TYPE_BADGE[group.videoType] || 'bg-surface-container-high text-on-surface-variant'

              return (
                <div key={group.id} className="bg-surface-container-low rounded-3xl border border-outline-variant/15 shadow-xl overflow-hidden flex flex-col relative group hover:border-outline-variant/40 transition-all duration-300">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`${badgeClass} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                          {group.videoType.replace('_', ' ')}
                        </span>
                        {group.versions.length > 1 && (
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-primary/20">
                            <FiLayers /> {group.versions.length} Versions
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] font-medium">
                        <FiClock /> {timeAgo(group.createdAt)}
                      </div>
                    </div>

                    <h2 className="font-bold text-xl text-on-surface mb-2 group-hover:text-primary transition-colors leading-tight">
                      {currentGen.output.title}
                    </h2>
                    <p className="text-on-surface-variant text-sm line-clamp-2 mb-4 leading-relaxed">{group.topic}</p>

                    {group.versions.length > 1 && (
                      <div className="flex gap-1 mb-4 bg-surface-container-highest/50 p-1 rounded-xl w-fit border border-outline-variant/10">
                        {group.versions.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveVersions(prev => ({ ...prev, [group.id]: i }))}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${vIdx === i ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                          >
                            V{i + 1}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="bg-surface-container-highest/30 rounded-2xl p-4 border border-outline-variant/10 backdrop-blur-sm">
                      <h3 className="text-[10px] font-bold text-primary uppercase mb-2 flex items-center gap-2 tracking-widest">
                        <FiList /> Scene Preview
                      </h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 italic leading-relaxed">"{currentGen.output.scenes[0]?.script}"</p>
                    </div>
                  </div>

                  <div className="bg-surface-container-highest/40 px-6 py-4 border-t border-outline-variant/15 flex justify-between items-center backdrop-blur-md">
                    <button
                      onClick={() => handlePreview(group)}
                      className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors font-bold text-sm"
                    >
                      <FiPlayCircle className="text-xl" /> Preview & Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(currentGen._id)}
                      disabled={deletingId === currentGen._id}
                      className="text-error-dim hover:text-error p-2 rounded-xl hover:bg-error/10 transition-colors disabled:opacity-50"
                    >
                      {deletingId === currentGen._id ? <FiLoader className="animate-spin text-lg" /> : <FiTrash2 className="text-lg" />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-[fade-in_0.2s_ease]">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-surface-container-low rounded-3xl border border-error/20 shadow-[0_24px_48px_rgba(0,0,0,0.5),0_0_40px_rgba(255,110,132,0.05)] overflow-hidden animate-[scale-in_0.2s_ease]">
            <div className="p-6 sm:p-8">
              <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center mb-6 border border-error/20">
                <FiAlertTriangle className="text-error text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Delete Script?</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">This action is permanent and cannot be undone.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-variant transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 px-6 py-3 rounded-xl bg-error text-on-error font-bold text-sm hover:opacity-90 shadow-lg shadow-error/20 transition-all active:scale-[0.98]">Yes, Delete</button>
              </div>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface transition-colors"><FiX className="text-xl" /></button>
          </div>
        </div>
      )}
    </main>
  )
}
