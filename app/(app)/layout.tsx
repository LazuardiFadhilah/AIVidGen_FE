import Sidebar from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />
      {/* Content offset for desktop sidebar */}
      <div className="flex-1 md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0">
        {children}
      </div>
    </div>
  )
}
