'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { 
  FiChevronDown, 
  FiUsers, 
  FiX, 
  FiLoader, 
  FiZap, 
  FiCheck, 
  FiCopy, 
  FiDownload,
  FiSave,
  FiFileText,
  FiLayers,
  FiWind,
  FiStar
} from 'react-icons/fi'

const VIDEO_TYPES = [
  { value: 'marketing', label: 'Marketing Explainer' },
  { value: 'educational', label: 'Educational Tutorial' },
  { value: 'social_media', label: 'Social Media Ad' },
  { value: 'explainer', label: 'Explainer Video' },
]

const TONES = [
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'inspirational', label: 'Inspirational' },
]

const DURATIONS = ['15s', '30s', '60s', '90s']

interface Scene { sceneNumber: number; timeRange: string; visual: string; script: string }
interface GenerationOutput { title: string; fullScript: string; scenes: Scene[] }
interface Generation { _id: string; videoType: string; topic: string; audience?: string; tone: string; duration: string; keywords: string[]; output: GenerationOutput }

export default function DashboardPage() {
  const [videoType, setVideoType] = useState('marketing')
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')
  const [tone, setTone] = useState('casual')
  const [duration, setDuration] = useState('30s')
  const [keywordInput, setKeywordInput] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  
  const [loading, setLoading] = useState(false)
  const [isFastMode, setIsFastMode] = useState(false)
  const [results, setResults] = useState<(Generation | null)[]>([null, null, null])
  const [activeTab, setActiveTab] = useState(0)
  const [loadingStates, setLoadingStates] = useState<boolean[]>([false, false, false])
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [scriptOpen, setScriptOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const preview = localStorage.getItem('previewVersions')
    if (preview) {
      try {
        const versions: Generation[] = JSON.parse(preview)
        const newResults = [null, null, null] as (Generation | null)[]
        versions.slice(0, 3).forEach((v, i) => newResults[i] = v)
        setResults(newResults)
        const first = versions[0]
        if (first) {
          setEditingId(first._id)
          setVideoType(first.videoType); setTopic(first.topic); setAudience(first.audience || ''); setTone(first.tone); setDuration(first.duration); setKeywords(first.keywords || [])
          setIsFastMode(versions.length === 1)
        }
        localStorage.removeItem('previewVersions')
        toast.success('Project loaded!')
      } catch (e) { console.error(e) }
    }
  }, [])

  const handleTabChange = (idx: number) => {
    setActiveTab(idx)
    if (results[idx]) setEditingId(results[idx]?._id || null)
    else setEditingId(null)
  }

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      if (!keywords.includes(keywordInput.trim())) setKeywords([...keywords, keywordInput.trim()])
      setKeywordInput('')
    }
  }

  const removeKeyword = (kw: string) => setKeywords(keywords.filter((k) => k !== kw))

  const generateOneVersion = async (index: number) => {
    setLoadingStates(prev => { const n = [...prev]; n[index] = true; return n })
    try {
      const { data } = await api.post('/generate', { videoType, topic, audience, tone, duration, keywords })
      setResults(prev => { const n = [...prev]; n[index] = data.generation; return n })
      if (index === activeTab) setEditingId(data.generation._id)
    } catch (err) { toast.error(`V${index + 1} failed`) }
    finally { setLoadingStates(prev => { const n = [...prev]; n[index] = false; return n }) }
  }

  const handleGenerateAction = async () => {
    if (!topic.trim()) { toast.error('Enter a topic'); return }
    setLoading(true); setResults([null, null, null]); setEditingId(null); setActiveTab(0)
    if (isFastMode) await generateOneVersion(0)
    else await Promise.all([generateOneVersion(0), generateOneVersion(1), generateOneVersion(2)])
    setLoading(false)
  }

  const handleUpdate = async () => {
    if (!editingId) return
    setLoading(true)
    try {
      const { data } = await api.put(`/history/${editingId}`, { videoType, topic, audience, tone, duration, keywords })
      setResults(prev => { const n = [...prev]; n[activeTab] = data.generation; return n })
      toast.success('Updated!')
    } catch (err) { toast.error('Failed') }
    finally { setLoading(false) }
  }

  const copyScript = (res: Generation) => {
    let c = `TITLE: ${res.output.title}\n\nSCENE BREAKDOWN\n\n`
    res.output.scenes.forEach(s => { 
      c += `SCENE ${s.sceneNumber} (${s.timeRange})\nVISUAL: ${s.visual}\nAUDIO: "${s.script}"\n\n` 
    })
    c += `FULL SCRIPT\n\n${res.output.fullScript}`
    
    navigator.clipboard.writeText(c)
    setCopied(true)
    toast.success('Script & Breakdown Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadScript = (res: Generation) => {
    let c = `TITLE: ${res.output.title}\n\nSCENE BREAKDOWN\n\n`
    res.output.scenes.forEach(s => { c += `SCENE ${s.sceneNumber} (${s.timeRange})\nVISUAL: ${s.visual}\nAUDIO: "${s.script}"\n\n` })
    c += `FULL SCRIPT\n\n${res.output.fullScript}`
    const b = new Blob([c], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a')
    a.href = u; a.download = `${res.output.title}_v${activeTab + 1}.txt`; a.click()
  }

  const isAnyLoading = loading || loadingStates.some(s => s)

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 bg-surface bg-[radial-gradient(ellipse_at_top_right,#131319_0%,transparent_60%)]">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-on-surface tracking-[-0.04em] mb-1">{editingId ? 'Edit Script' : 'AI Video Studio'}</h1>
            <p className="text-on-surface-variant text-sm">Professional AI scriptwriting and scene breakdown.</p>
          </div>
          {(editingId || results.some(r => r !== null)) && (
            <button onClick={() => { setEditingId(null); setResults([null, null, null]); setTopic(''); setKeywords([]) }} className="text-xs font-bold text-primary hover:underline">+ Create New</button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
          {/* Left Settings */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/15 shadow-xl">
              <div className="mb-6">
                <label className="block text-[10px] font-black text-on-surface-variant mb-3 uppercase tracking-[0.2em]">Video Type</label>
                <div className="relative">
                  <select value={videoType} onChange={(e) => setVideoType(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline-variant/15 rounded-xl py-3.5 pl-4 pr-10 appearance-none text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all">
                    {VIDEO_TYPES.map(vt => <option key={vt.value} value={vt.value}>{vt.label}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[10px] font-black text-on-surface-variant mb-3 uppercase tracking-[0.2em]">Target Audience</label>
                <div className="relative">
                  <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. Young Professionals" className="w-full bg-surface-container-high border border-outline-variant/15 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-on-surface-variant mb-3 uppercase tracking-[0.2em]">Voice Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map(t => (
                    <button key={t.value} onClick={() => setTone(t.value)} className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all ${tone === t.value ? 'bg-primary/20 text-primary border-primary/40 shadow-sm' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/15 hover:bg-surface-variant'}`}>{t.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/15 shadow-ambient h-full flex flex-col gap-6">
              <div className="flex-1 flex flex-col">
                <label className="text-[10px] font-black text-on-surface-variant mb-3 uppercase tracking-[0.2em] flex justify-between">Topic / Core Idea <span className="text-primary">AI Engine v2</span></label>
                <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Describe your video idea in detail..." className="w-full flex-1 min-h-[140px] bg-surface-container-lowest text-on-surface border border-outline-variant/15 rounded-2xl py-4 px-5 font-headline text-base resize-none focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-on-surface-variant/30" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-on-surface-variant mb-3 uppercase tracking-[0.2em]">Keywords</label>
                  <input type="text" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={addKeyword} placeholder="Type & Press Enter" className="w-full bg-surface-container-high border border-outline-variant/15 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {keywords.map(kw => <span key={kw} className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-secondary/20">{kw} <button onClick={() => removeKeyword(kw)} className="hover:text-secondary-dim transition-colors"><FiX /></button></span>)}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-on-surface-variant mb-3 uppercase tracking-[0.2em]">Duration</label>
                  <div className="flex bg-surface-container-lowest p-1.5 rounded-xl border border-outline-variant/15 gap-1">
                    {DURATIONS.map(d => <button key={d} onClick={() => setDuration(d)} className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${duration === d ? 'bg-surface-container-highest text-primary shadow-sm border border-outline-variant/20' : 'text-on-surface-variant hover:text-on-surface'}`}>{d}</button>)}
                  </div>
                </div>
              </div>

              {/* NEW UX: MODE SELECTION CTA */}
              {!editingId && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                    <button 
                      onClick={() => setIsFastMode(false)}
                      className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all border ${!isFastMode ? 'bg-primary/10 border-primary/40 text-primary shadow-sm' : 'bg-transparent border-transparent text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                      <FiLayers className="mb-1 text-lg" />
                      <span className="text-[11px] font-black uppercase tracking-tighter">Creative Mode</span>
                      <span className="text-[9px] opacity-60">3 Variations</span>
                    </button>
                    <button 
                      onClick={() => setIsFastMode(true)}
                      className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all border ${isFastMode ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-sm' : 'bg-transparent border-transparent text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                      <FiZap className="mb-1 text-lg" />
                      <span className="text-[11px] font-black uppercase tracking-tighter">Fast Mode</span>
                      <span className="text-[9px] opacity-60">1 Quick Version</span>
                    </button>
                  </div>

                  <button
                    onClick={handleGenerateAction}
                    disabled={isAnyLoading}
                    className={`w-full py-5 px-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl ${
                      isFastMode 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/30' 
                        : 'bg-gradient-to-r from-primary to-primary-dim text-on-primary shadow-primary/30'
                    }`}
                  >
                    {isAnyLoading ? <FiLoader className="text-2xl animate-spin" /> : isFastMode ? <FiZap className="text-2xl" /> : <FiStar className="text-2xl" />}
                    <span className="text-sm">
                      {isAnyLoading ? 'Crafting Script...' : isFastMode ? 'Generate Fast' : 'Generate 3 Variations'}
                    </span>
                  </button>
                </div>
              )}

              {editingId && (
                <button
                  onClick={handleUpdate}
                  disabled={isAnyLoading}
                  className="w-full py-5 px-6 rounded-2xl font-black uppercase tracking-widest bg-gradient-to-r from-secondary to-secondary-dim text-on-primary shadow-secondary/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isAnyLoading ? <FiLoader className="text-2xl animate-spin" /> : <FiSave className="text-2xl" />}
                  <span className="text-sm">{isAnyLoading ? 'Updating...' : `Update Version ${activeTab + 1}`}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Tabs */}
        {(results.some(r => r !== null) || isAnyLoading) && (
          <div className="space-y-6 animate-[fade-in_0.4s_ease]">
            {!isFastMode && (
              <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-2xl border border-outline-variant/15 w-fit print:hidden backdrop-blur-md">
                {[0, 1, 2].map((idx) => (
                  <button key={idx} onClick={() => handleTabChange(idx)} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === idx ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                    Version {idx + 1} {loadingStates[idx] ? <FiLoader className="animate-spin" /> : results[idx] ? <FiCheck /> : null}
                  </button>
                ))}
              </div>
            )}

            {loadingStates[activeTab] ? (
              <div className="h-80 flex flex-col items-center justify-center bg-surface-container-low/50 rounded-3xl border border-outline-variant/15 border-dashed backdrop-blur-sm">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 animate-bounce ${isFastMode ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                  {isFastMode ? <FiZap className="text-3xl" /> : <FiLayers className="text-3xl" />}
                </div>
                <p className="text-on-surface font-bold text-xl">AI is crafting your script...</p>
                <p className="text-on-surface-variant text-sm mt-2">Hang tight, this usually takes a few seconds.</p>
              </div>
            ) : results[activeTab] ? (
              <div className="space-y-6">
                <div className="bg-surface-container-low rounded-3xl p-6 border border-primary/20 shadow-ambient backdrop-blur-md">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20">{results[activeTab]?.videoType.replace('_', ' ')}</span>
                        <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold border border-outline-variant/30">{results[activeTab]?.duration}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-on-surface tracking-tight leading-tight">{results[activeTab]?.output.title}</h2>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 print:hidden">
                      <button onClick={() => results[activeTab] && copyScript(results[activeTab]!)} className="bg-surface-container-highest text-on-surface border border-outline-variant/15 rounded-xl py-2.5 px-4 text-xs font-bold hover:bg-surface-variant transition-all flex items-center gap-2">{copied ? <FiCheck /> : <FiCopy />} Copy</button>
                      <button onClick={() => results[activeTab] && downloadScript(results[activeTab]!)} className="bg-surface-container-highest text-on-surface border border-outline-variant/15 rounded-xl py-2.5 px-4 text-xs font-bold hover:bg-surface-variant transition-all flex items-center gap-2"><FiDownload /> .txt</button>
                      <button onClick={() => window.print()} className="bg-primary text-on-primary rounded-xl py-2.5 px-4 text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"><FiFileText /> PDF</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {results[activeTab]?.output.scenes.map((scene) => (
                    <div key={scene.sceneNumber} className="bg-surface-container-low/40 rounded-2xl p-6 border border-outline-variant/10 flex flex-col md:flex-row gap-6 transition-all hover:border-outline-variant/30 print:break-inside-avoid backdrop-blur-sm">
                      <div className="md:w-1/5">
                        <span className="text-primary font-black text-xs uppercase tracking-tighter block mb-1">Scene {String(scene.sceneNumber).padStart(2, '0')}</span>
                        <div className="flex items-center gap-1.5 text-on-surface-variant text-[10px] font-bold uppercase"><FiWind /> {scene.timeRange}</div>
                      </div>
                      <div className="md:w-4/5 space-y-4">
                        <div><h4 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">Visual Direction</h4><p className="text-on-surface text-sm leading-relaxed">{scene.visual}</p></div>
                        <div className="bg-surface-container-lowest/50 p-4 rounded-xl border border-outline-variant/5"><h4 className="text-[10px] font-bold text-tertiary uppercase tracking-[0.2em] mb-2">Audio / Narration</h4><p className="text-on-surface-variant text-sm italic leading-relaxed">"{scene.script}"</p></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-surface-container-low rounded-3xl border border-outline-variant/15 overflow-hidden print:border-none backdrop-blur-md">
                  <button onClick={() => setScriptOpen(!scriptOpen)} className="w-full flex items-center justify-between p-5 text-on-surface hover:bg-surface-container-highest transition-all print:hidden">
                    <span className="font-bold text-sm flex items-center gap-2"><FiFileText className="text-primary" /> View Full Script</span>
                    <FiChevronDown className={`transition-transform duration-300 ${scriptOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`${scriptOpen ? 'block' : 'hidden'} px-5 pb-5 print:block print:p-0`}>
                    <pre className="bg-surface-container-lowest/50 rounded-2xl p-6 text-on-surface text-sm leading-relaxed whitespace-pre-wrap font-sans border border-outline-variant/10 print:bg-transparent print:p-0 print:border-none">
                      {results[activeTab]?.output.fullScript}
                    </pre>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </main>
  )
}
