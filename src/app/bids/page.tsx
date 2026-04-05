'use client';
import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import { mockBids } from '@/lib/mockData';
import { StatusBadge, TypeBadge } from '@/components/ui/Badge';
import { exportBidsToExcel } from '@/lib/excelExport';
import Link from 'next/link';
import { Search, Filter, Download, Bookmark, BookmarkCheck, ChevronDown, X } from 'lucide-react';
import { Bid, BidStatus, NoticeType } from '@/types';

const NOTICE_TYPES: NoticeType[] = [
  'Solicitation', 'Presolicitation', 'Award Notice',
  'Sources Sought', 'Combined Synopsis/Solicitation', 'Modification/Amendment',
];
const STATUSES: BidStatus[] = ['active', 'presolicitation', 'awarded', 'modified', 'closed'];
const STATUS_LABELS: Record<BidStatus, string> = {
  active: '진행중', presolicitation: '사전공지', awarded: '낙찰', modified: '변경', closed: '마감',
};

function formatValue(val?: number) {
  if (!val) return '-';
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  return `$${val.toLocaleString()}`;
}

function daysLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - new Date('2026-03-24').getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function BidsPage() {
  const [search, setSearch] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<BidStatus[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<NoticeType[]>([]);
  const [naicsFilter, setNaicsFilter] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'postedDate' | 'responseDeadline'>('postedDate');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(mockBids.filter(b => b.saved).map(b => b.id)));
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...mockBids];
    if (savedOnly) result = result.filter(b => savedIds.has(b.id));
    if (search) result = result.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.agency.toLowerCase().includes(search.toLowerCase()) ||
      b.solicitationNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.naicsCode.includes(search) ||
      b.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
    );
    if (selectedStatuses.length) result = result.filter(b => selectedStatuses.includes(b.status));
    if (selectedTypes.length) result = result.filter(b => selectedTypes.includes(b.type));
    if (naicsFilter) result = result.filter(b => b.naicsCode.startsWith(naicsFilter));
    if (agencyFilter) result = result.filter(b => b.agency.toLowerCase().includes(agencyFilter.toLowerCase()));

    result.sort((a, b) => {
      if (sortBy === 'postedDate') return b.postedDate.localeCompare(a.postedDate);
      if (sortBy === 'responseDeadline') return a.responseDeadline.localeCompare(b.responseDeadline);
      return 0;
    });
    return result;
  }, [search, selectedStatuses, selectedTypes, naicsFilter, agencyFilter, savedOnly, savedIds, sortBy]);

  function toggleStatus(s: BidStatus) {
    setSelectedStatuses(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }
  function toggleType(t: NoticeType) {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }
  function toggleSave(id: string, e: React.MouseEvent) {
    e.preventDefault();
    setSavedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const activeFilters = selectedStatuses.length + selectedTypes.length + (naicsFilter ? 1 : 0) + (agencyFilter ? 1 : 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="입찰 공고" subtitle={`총 ${filtered.length}건`} />
      <div className="flex-1 p-8 space-y-4">

        {/* Top Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="공고명, 기관명, 공고번호, NAICS 코드 검색..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${showFilters || activeFilters ? 'bg-[#111] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
          >
            <Filter className="w-4 h-4" />
            필터
            {activeFilters > 0 && <span className="bg-white text-[#111] text-xs px-1.5 py-0.5 rounded-full font-bold">{activeFilters}</span>}
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm cursor-pointer hover:border-gray-300 transition-colors">
            <input type="checkbox" checked={savedOnly} onChange={e => setSavedOnly(e.target.checked)} className="accent-black" />
            저장된 공고
          </label>

          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none cursor-pointer"
            >
              <option value="postedDate">게시일순</option>
              <option value="responseDeadline">마감일순</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => exportBidsToExcel(filtered)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors"
          >
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">상태</label>
                <div className="flex flex-wrap gap-1.5">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleStatus(s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedStatuses.includes(s) ? 'bg-[#111] text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">공고 유형</label>
                <div className="flex flex-wrap gap-1.5">
                  {NOTICE_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => toggleType(t)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedTypes.includes(t) ? 'bg-[#111] text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                    >
                      {t === 'Combined Synopsis/Solicitation' ? '통합공고' : t === 'Modification/Amendment' ? '변경' : t === 'Award Notice' ? '낙찰' : t === 'Sources Sought' ? '업체탐색' : t === 'Presolicitation' ? '사전공지' : '공고'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">NAICS 코드</label>
                <input
                  value={naicsFilter}
                  onChange={e => setNaicsFilter(e.target.value)}
                  placeholder="예: 561, 236220"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">발주 기관</label>
                <input
                  value={agencyFilter}
                  onChange={e => setAgencyFilter(e.target.value)}
                  placeholder="예: DLA, USACE, IMCOM"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
            </div>
            {activeFilters > 0 && (
              <button
                onClick={() => { setSelectedStatuses([]); setSelectedTypes([]); setNaicsFilter(''); setAgencyFilter(''); }}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                필터 초기화
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-8"></th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">공고 정보</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">유형/상태</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">NAICS</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">금액</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">게시일</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">마감</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400 text-sm">
                      조건에 맞는 공고가 없습니다.
                    </td>
                  </tr>
                )}
                {filtered.map((bid) => {
                  const days = daysLeft(bid.responseDeadline);
                  const urgent = bid.status === 'active' && days <= 7 && days > 0;
                  return (
                    <tr key={bid.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <button onClick={(e) => toggleSave(bid.id, e)} className="text-gray-300 hover:text-yellow-400 transition-colors">
                          {savedIds.has(bid.id)
                            ? <BookmarkCheck className="w-4 h-4 text-yellow-400" />
                            : <Bookmark className="w-4 h-4" />
                          }
                        </button>
                      </td>
                      <td className="px-4 py-4 max-w-xs">
                        <Link href={`/bids/${bid.id}`} className="group">
                          <div className="text-sm font-medium text-[#111] group-hover:underline line-clamp-2">{bid.title}</div>
                          <div className="text-xs text-gray-400 mt-1">{bid.agency} · {bid.solicitationNumber}</div>
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <TypeBadge type={bid.type} />
                          <StatusBadge status={bid.status} />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs font-mono font-medium text-gray-700">{bid.naicsCode}</div>
                        <div className="text-xs text-gray-400 mt-0.5 max-w-[120px] truncate">{bid.naicsDescription}</div>
                      </td>
                      <td className="px-4 py-4">
                        {bid.status === 'awarded' && bid.awardAmount ? (
                          <div>
                            <div className="text-sm font-semibold text-blue-600">{formatValue(bid.awardAmount)}</div>
                            <div className="text-xs text-gray-400">낙찰금액</div>
                          </div>
                        ) : <span className="text-xs text-gray-400">-</span>}
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500">{bid.postedDate}</td>
                      <td className="px-4 py-4">
                        <div className={`text-xs font-medium ${urgent ? 'text-orange-600' : 'text-gray-500'}`}>
                          {bid.responseDeadline}
                        </div>
                        {urgent && (
                          <div className="text-xs text-orange-500 mt-0.5 font-semibold">D-{days}</div>
                        )}
                        {bid.status === 'awarded' && bid.awardDate && (
                          <div className="text-xs text-blue-400 mt-0.5">낙찰: {bid.awardDate}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <span className="text-xs text-gray-400">총 {filtered.length}건 표시</span>
            <button onClick={() => exportBidsToExcel(filtered)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#111] transition-colors">
              <Download className="w-3.5 h-3.5" /> 엑셀로 내보내기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
