'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  FiHexagon, 
  FiPlus, 
  FiVideo, 
  FiClock, 
  FiSettings, 
  FiHelpCircle, 
  FiLogOut, 
  FiMenu, 
  FiX 
} from 'react-icons/fi'

const navItems = [
  { href: '/dashboard', icon: FiVideo, label: 'Generate' },
  { href: '/history', icon: FiClock, label: 'History' },
]

interface User { name: string; email: string }

interface SidebarContentProps {
  pathname: string
  user: User | null
  handleLogout: () => void
  setMobileOpen: (open: boolean) => void
}

const SidebarContent = ({ pathname, user, handleLogout, setMobileOpen }: SidebarContentProps) => (
  <div className="flex flex-col p-5 gap-6 h-full">
    {/* Brand */}
    <div className="flex items-center gap-3 px-2 pt-1">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center shadow-[0_0_12px_rgba(189,157,255,0.3)] flex-shrink-0">
        <FiHexagon className="text-on-primary text-base fill-current" />
      </div>
      <div>
        <span className="text-lg font-bold tracking-tighter text-primary">AIVidGen</span>
        <p className="text-xs text-on-surface-variant leading-none mt-0.5">Pro Studio</p>
      </div>
    </div>

    {/* New Project CTA - Hidden on Dashboard to avoid redundancy */}
    {pathname !== '/dashboard' && (
      <Link
        href="/dashboard"
        className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(189,157,255,0.15)] text-sm"
        onClick={() => setMobileOpen(false)}
      >
        <FiPlus className="text-lg" />
        Create New Video
      </Link>
    )}

    {/* Nav */}
    <nav className="flex-1 flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary border-l-4 border-primary'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-4 border-transparent'
            }`}
          >
            <Icon className={`text-xl ${isActive ? 'fill-primary/20' : ''}`} />
            {item.label}
          </Link>
        )
      })}
    </nav>

    {/* Footer */}
    <div className="flex flex-col gap-1 pt-4 border-t border-outline-variant/15">
      <Link href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all">
        <FiHelpCircle className="text-xl" />
        Support
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-error/10 hover:text-error transition-all text-left"
      >
        <FiLogOut className="text-xl" />
        Logout
      </button>

      {/* User chip */}
      {user && (
        <div className="px-4 py-3 flex items-center gap-3 mt-2 border-t border-outline-variant/15 pt-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center text-on-primary text-sm font-bold flex-shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
            <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
          </div>
        </div>
      )}
    </div>
  </div>
)

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse user from localStorage', e)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-surface-container-low border-r border-outline-variant/10 shadow-[4px_0_24px_rgba(0,0,0,0.4)] z-50">
        <SidebarContent 
          pathname={pathname} 
          user={user} 
          handleLogout={handleLogout} 
          setMobileOpen={setMobileOpen} 
        />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-surface-container-low/90 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
            <FiHexagon className="text-on-primary text-sm fill-current" />
          </div>
          <span className="text-base font-bold text-primary tracking-tight">AIVidGen</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-on-surface-variant hover:text-on-surface transition-colors p-2"
        >
          {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 h-full w-72 bg-surface-container-low shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="pt-16">
              <SidebarContent 
                pathname={pathname} 
                user={user} 
                handleLogout={handleLogout} 
                setMobileOpen={setMobileOpen} 
              />
            </div>
          </aside>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-low/95 backdrop-blur-xl border-t border-outline-variant/10">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                <Icon className={`text-2xl ${isActive ? 'fill-primary/20' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
