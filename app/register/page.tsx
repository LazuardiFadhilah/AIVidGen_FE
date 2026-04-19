'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/lib/api'

const getPasswordStrength = (password: string) => {
  if (password.length === 0) return { label: '', color: '', width: '0%' }
  if (password.length < 6) return { label: 'Weak', color: 'bg-error', width: '25%' }
  if (password.length < 10) return { label: 'Medium', color: 'bg-yellow-500', width: '60%' }
  return { label: 'Strong', color: 'bg-green-500', width: '100%' }
}

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const strength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (!agreed) {
      toast.error('Please agree to the Terms of Service')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      toast.error(msg || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#0a0a0f]"
      style={{ backgroundImage: 'radial-gradient(circle at center, rgba(189,157,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>

      {/* Glow blobs */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-primary-dim/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[440px] bg-[#111118] rounded-3xl p-8 sm:p-10 border border-white/5 shadow-[0px_24px_48px_rgba(0,0,0,0.4),0px_0px_40px_rgba(189,157,255,0.05)] overflow-hidden">

        {/* Card glow */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center shadow-[0_0_15px_rgba(189,157,255,0.3)]">
            <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-gradient-primary">AIVidGen</span>
        </div>

        <div className="mb-7 text-center">
          <h1 className="text-xl font-bold text-on-surface mb-1 tracking-tight">Create your account</h1>
          <p className="text-sm text-on-surface-variant">Start generating AI video scripts today</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-on-surface-variant ml-1">Full Name</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">person</span>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface placeholder:text-outline/50 focus:border-primary-dim/50 focus:ring-1 focus:ring-primary-dim/50 transition-all outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-on-surface-variant ml-1">Email</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">mail</span>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface placeholder:text-outline/50 focus:border-primary-dim/50 focus:ring-1 focus:ring-primary-dim/50 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-on-surface-variant ml-1">Password</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">lock</span>
              <input
                type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl py-3 pl-12 pr-12 text-sm text-on-surface placeholder:text-outline/50 focus:border-primary-dim/50 focus:ring-1 focus:ring-primary-dim/50 transition-all outline-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
              </button>
            </div>
            {/* Strength bar */}
            {password.length > 0 && (
              <div className="flex items-center gap-2 mt-1.5 px-1">
                <div className="h-1 flex-1 bg-surface-container-high rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} rounded-full transition-all duration-500`} style={{ width: strength.width }} />
                </div>
                <span className={`text-[11px] font-medium ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-on-surface-variant ml-1">Confirm Password</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">lock</span>
              <input
                type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface placeholder:text-outline/50 focus:border-primary-dim/50 focus:ring-1 focus:ring-primary-dim/50 transition-all outline-none"
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-outline-variant bg-surface-container-high accent-primary"
            />
            <label className="text-xs text-on-surface-variant leading-relaxed">
              I agree to the{' '}
              <a href="#" className="text-primary hover:text-primary-dim transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:text-primary-dim transition-colors">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold text-sm tracking-wide shadow-primary-glow hover:shadow-[0_6px_25px_rgba(189,157,255,0.35)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-on-surface-variant">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:text-primary-dim transition-colors ml-1">Login</Link>
        </p>
      </div>
    </div>
  )
}
