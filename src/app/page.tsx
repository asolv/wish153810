'use client';
import Header from '@/components/layout/Header';
import { mockStats, mockBids, mockAwardData } from '@/lib/mockData';
import { StatusBadge, TypeBadge } from '@/components/ui/Badge';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, FileText, Clock, Award, DollarSign, Filter, ArrowRight, AlertTriangle } from 'lucide-react';

const statCards = [
  { label: '수집 총 공고', value: mockStats.totalBids.toLocaleString(), unit: '건', icon: FileText, dark: true, sub: '전체 기간' },
  { label: '오늘 신규', value: String(mockStats.newToday), unit: '건', icon: TrendingUp, dark: false, sub: '↑ 전일 +5' },
  { label: '마감 임박', value: String(mockStats.closingSoon), unit: '건', icon: Clock, dark: false, sub: '7일 이내', alert: true },
  { label: '낙찰 공고', value: String(mockStats.awards), unit: '건', icon: Award, dark: false, sub: '이번 달' },
  { label: '낙찰 금액', value: '$1.85B', unit: '', icon: DollarSign, dark: false, sub: '이번 달 누계' },
  { label: '필터 매칭', value: String(mockStats.matchedFilters), unit: '건', icon: Filter, dark: false, sub: '내 필터 기준' },
];

const monthlyData = mockAwardData.map((d) => ({
  label: `${d.month.slice(5)}월`,
  amount: Math.round(d.amount / 1000000),
}));

const recentBids = mockBids.filter((b) => b.status === 'active' || b.status === 'presolicitation').slice(0, 5);
const closingSoon = mockBids
  .filter((b) => b.status === 'active')
  .sort((a, b) => new Date(a.responseDeadline).getTime() - new Date(b.responseDeadline).getTime())
  .slice(0, 4);

function daysLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - new Date('2026-03-24').getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatValue(val?: number) {
  if (!val) return null;
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  return `$${val.toLocaleString()}`;
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="대시보드" subtitle="2026년 03월 24일 기준 · 오전 9:00 자동 수집 완료" />

      <div className="flex-1 p-4 md:p-8 space-y-5 md:space-y-8">

        {/* Stats Grid - 2열 모바일, 3열 태블릿, 6열 데스크탑 */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`rounded-xl p-4 md:p-5 border ${card.dark ? 'bg-[#111] border-transparent' : 'bg-white border-gray-200'}`}
              >
                <div className={`flex items-center justify-between mb-2 md:mb-3 ${card.dark ? 'text-white/50' : 'text-gray-400'}`}>
                  <span className="text-xs font-medium leading-tight">{card.label}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {card.alert && <AlertTriangle className="w-3 h-3 text-orange-400" />}
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                </div>
                <div className={`text-xl md:text-2xl font-bold ${card.dark ? 'text-white' : 'text-[#111]'}`}>
                  {card.value}
                  <span className={`text-xs md:text-sm font-normal ml-1 ${card.dark ? 'text-white/50' : 'text-gray-400'}`}>{card.unit}</span>
                </div>
                <div className={`text-xs mt-1 ${card.dark ? 'text-white/30' : 'text-gray-400'}`}>{card.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Charts - 모바일은 세로 스택 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="mb-4 md:mb-6">
              <h2 className="font-semibold text-[#111] text-sm md:text-base">월별 낙찰 금액 추이</h2>
              <p className="text-xs md:text-sm text-gray-400 mt-0.5">2025년 USFK 낙찰 현황 (백만 달러)</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#111" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip
                  formatter={(v: unknown) => [`$${v as number}M`, '낙찰금액']}
                  contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="amount" stroke="#111" strokeWidth={2} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <h2 className="font-semibold text-[#111] text-sm md:text-base mb-1">공고 유형 분포</h2>
            <p className="text-xs md:text-sm text-gray-400 mb-4 md:mb-6">이번 달 기준</p>
            {[
              { label: '입찰 공고', count: 28, pct: 58, color: '#111' },
              { label: '낙찰 공고', count: 9, pct: 19, color: '#555' },
              { label: '사전 공지', count: 7, pct: 15, color: '#888' },
              { label: '업체 탐색', count: 4, pct: 8, color: '#bbb' },
            ].map((item) => (
              <div key={item.label} className="mb-3 md:mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs md:text-sm text-gray-600">{item.label}</span>
                  <span className="text-xs md:text-sm font-semibold text-[#111]">{item.count}건</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent + Closing - 모바일은 세로 스택 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Recent Bids */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[#111] text-sm md:text-base">최근 수집 공고</h2>
              <Link href="/bids" className="text-xs md:text-sm text-gray-400 hover:text-[#111] flex items-center gap-1 transition-colors">
                전체보기 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentBids.map((bid) => (
                <Link key={bid.id} href={`/bids/${bid.id}`} className="flex items-start gap-3 px-4 md:px-6 py-3 md:py-4 hover:bg-gray-50 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <TypeBadge type={bid.type} />
                      <StatusBadge status={bid.status} />
                    </div>
                    <div className="text-xs md:text-sm font-medium text-[#111] line-clamp-2 group-hover:underline">{bid.title}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-gray-400 truncate max-w-[120px] md:max-w-none">{bid.agency}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-gray-400 hidden sm:block">{bid.postedDate}</div>
                    <div className="text-xs text-gray-400 mt-0.5">~{bid.responseDeadline.slice(5)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Closing Soon */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[#111] text-sm md:text-base">마감 임박</h2>
              <span className="text-xs font-medium px-2 py-1 bg-orange-50 text-orange-600 rounded-full">7일 이내</span>
            </div>
            <div className="divide-y divide-gray-50">
              {closingSoon.map((bid) => {
                const days = daysLeft(bid.responseDeadline);
                return (
                  <Link key={bid.id} href={`/bids/${bid.id}`} className="flex items-start gap-3 px-4 md:px-6 py-3 md:py-4 hover:bg-gray-50 transition-colors group">
                    <div className={`flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg flex flex-col items-center justify-center ${days <= 5 ? 'bg-red-50' : 'bg-orange-50'}`}>
                      <span className={`text-base md:text-lg font-bold leading-none ${days <= 5 ? 'text-red-600' : 'text-orange-600'}`}>{days}</span>
                      <span className={`text-xs ${days <= 5 ? 'text-red-400' : 'text-orange-400'}`}>일</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs md:text-sm font-medium text-[#111] line-clamp-2 group-hover:underline">{bid.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5 truncate">{bid.agency}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Bar - 모바일 세로 정렬 */}
        <div className="bg-[#111] rounded-xl px-4 md:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <div>
              <div className="text-white font-medium text-sm">SAM.gov API 연동 활성화</div>
              <div className="text-white/40 text-xs mt-0.5">수집 주기: 3시간 · 마지막 수집: 오늘 09:00</div>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 pl-5 sm:pl-0">
            {[{ label: '오늘', value: '23건' }, { label: '이번 주', value: '89건' }, { label: 'API', value: '정상' }].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-white font-semibold text-sm">{item.value}</div>
                <div className="text-white/40 text-xs">{item.label}</div>
              </div>
            ))}
            <Link href="/admin" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap">
              수집 로그
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
