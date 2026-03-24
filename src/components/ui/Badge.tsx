import { BidStatus, NoticeType } from '@/types';

const statusConfig: Record<BidStatus, { label: string; className: string }> = {
  active: { label: '진행중', className: 'bg-green-50 text-green-700 border-green-200' },
  closed: { label: '마감', className: 'bg-gray-100 text-gray-500 border-gray-200' },
  awarded: { label: '낙찰', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  presolicitation: { label: '사전공지', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  modified: { label: '변경', className: 'bg-orange-50 text-orange-700 border-orange-200' },
};

const typeConfig: Record<string, { label: string; className: string }> = {
  Solicitation: { label: '공고', className: 'bg-black text-white' },
  Presolicitation: { label: '사전공지', className: 'bg-yellow-100 text-yellow-800' },
  'Award Notice': { label: '낙찰공고', className: 'bg-blue-100 text-blue-800' },
  'Special Notice': { label: '특별공지', className: 'bg-purple-100 text-purple-800' },
  'Sources Sought': { label: '업체탐색', className: 'bg-indigo-100 text-indigo-800' },
  'Combined Synopsis/Solicitation': { label: '통합공고', className: 'bg-teal-100 text-teal-800' },
  'Modification/Amendment': { label: '변경', className: 'bg-orange-100 text-orange-800' },
};

export function StatusBadge({ status }: { status: BidStatus }) {
  const cfg = statusConfig[status] || statusConfig.active;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export function TypeBadge({ type }: { type: NoticeType | string }) {
  const cfg = typeConfig[type] || { label: type, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export function UsfkBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#111] text-white">
      ★ USFK
    </span>
  );
}
