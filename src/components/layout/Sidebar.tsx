'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, BarChart2, Filter, Settings,
  ChevronRight, Star, Shield, X,
} from 'lucide-react';

const navItems = [
  { href: '/', label: '대시보드', icon: LayoutDashboard },
  { href: '/bids', label: '입찰 공고', icon: FileText },
  { href: '/analysis', label: '데이터 분석', icon: BarChart2 },
  { href: '/filters', label: '필터 · 알림 설정', icon: Filter },
  { href: '/admin', label: '관리자', icon: Settings },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen bg-[#111] flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Star className="w-4 h-4 text-[#111]" fill="currentColor" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">USFK BidTrack</div>
            <div className="text-white/40 text-xs">미군 입찰 정보 시스템</div>
          </div>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? 'bg-white text-[#111] font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-3.5 h-3.5 text-white/80" />
          </div>
          <div>
            <div className="text-white text-xs font-medium">김민준</div>
            <div className="text-white/40 text-xs">관리자</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-white/40 text-xs">SAM.gov 연결됨</span>
        </div>
      </div>
    </aside>
  );
}
