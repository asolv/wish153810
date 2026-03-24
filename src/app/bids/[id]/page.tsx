'use client';
import { use } from 'react';
import { mockBids } from '@/lib/mockData';
import { StatusBadge, TypeBadge, UsfkBadge } from '@/components/ui/Badge';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, DollarSign, User, Mail, Phone, ExternalLink, Bookmark, BookmarkCheck, Share2, FileText } from 'lucide-react';
import { useState } from 'react';

function formatValue(val?: number) {
  if (!val) return '-';
  return `$${val.toLocaleString()}`;
}

export default function BidDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const bid = mockBids.find(b => b.id === id);
  const [saved, setSaved] = useState(bid?.saved || false);
  const [copied, setCopied] = useState(false);

  if (!bid) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="공고 상세" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-lg font-semibold text-gray-700">공고를 찾을 수 없습니다</div>
            <Link href="/bids" className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#111]">
              <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const similarBids = mockBids.filter(b => b.id !== bid.id && b.naicsCode.slice(0, 3) === bid.naicsCode.slice(0, 3)).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="공고 상세" subtitle={bid.solicitationNumber} />
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Back */}
          <Link href="/bids" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#111] transition-colors">
            <ArrowLeft className="w-4 h-4" /> 공고 목록으로
          </Link>

          {/* Title Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <TypeBadge type={bid.type} />
                  <StatusBadge status={bid.status} />
                  {bid.isUsfk && <UsfkBadge />}
                  {bid.setAside && (
                    <span className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded font-medium">
                      {bid.setAside}
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold text-[#111] leading-snug">{bid.title}</h1>
                <div className="mt-2 text-sm text-gray-500">
                  {bid.agency}{bid.office && ` · ${bid.office}`}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  title="링크 복사"
                >
                  <Share2 className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setSaved(!saved)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${saved ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {saved ? '저장됨' : '저장하기'}
                </button>
                <a
                  href={`https://sam.gov/opp/${bid.noticeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  SAM.gov 원문 <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            {copied && <div className="mt-2 text-xs text-green-600">링크가 복사되었습니다!</div>}

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">게시일</div>
                  <div className="text-sm font-semibold text-[#111] mt-0.5">{bid.postedDate}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-orange-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">마감일</div>
                  <div className="text-sm font-semibold text-[#111] mt-0.5">{bid.responseDeadline}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">{bid.status === 'awarded' ? '낙찰 금액' : '추정 금액'}</div>
                  <div className="text-sm font-semibold text-[#111] mt-0.5">
                    {bid.status === 'awarded' ? formatValue(bid.awardAmount) : formatValue(bid.estimatedValue)}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">수행 지역</div>
                  <div className="text-sm font-semibold text-[#111] mt-0.5">
                    {bid.placeOfPerformance.city}, {bid.placeOfPerformance.country}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Description */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-[#111] mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> 공고 내용
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{bid.description}</p>
              </div>

              {/* Award Info */}
              {bid.status === 'awarded' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h2 className="font-semibold text-blue-900 mb-4">낙찰 정보</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-blue-600">낙찰 업체</div>
                      <div className="text-sm font-bold text-blue-900 mt-1">{bid.awardee}</div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-600">낙찰 금액</div>
                      <div className="text-sm font-bold text-blue-900 mt-1">{formatValue(bid.awardAmount)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-600">낙찰일</div>
                      <div className="text-sm font-semibold text-blue-900 mt-1">{bid.awardDate}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Keywords */}
              {bid.keywords.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="font-semibold text-[#111] mb-3">키워드</h2>
                  <div className="flex flex-wrap gap-2">
                    {bid.keywords.map(k => (
                      <span key={k} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{k}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Bids */}
              {similarBids.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="font-semibold text-[#111] mb-4">유사 공고</h2>
                  <div className="space-y-3">
                    {similarBids.map(b => (
                      <Link key={b.id} href={`/bids/${b.id}`} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#111] group-hover:underline line-clamp-1">{b.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={b.status} />
                            <span className="text-xs text-gray-400">{b.responseDeadline}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right - Details */}
            <div className="space-y-4">
              {/* Classification */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-[#111] mb-4 text-sm">공고 분류</h3>
                <dl className="space-y-3">
                  {[
                    { label: '공고 번호', value: bid.solicitationNumber },
                    { label: 'NAICS 코드', value: bid.naicsCode },
                    { label: 'NAICS 설명', value: bid.naicsDescription || '-' },
                    { label: '중소기업 우대', value: bid.setAside || '해당없음' },
                  ].map(item => (
                    <div key={item.label}>
                      <dt className="text-xs text-gray-400">{item.label}</dt>
                      <dd className="text-sm text-gray-700 mt-0.5 font-medium">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Contact */}
              {(bid.contactName || bid.contactEmail) && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-[#111] mb-4 text-sm">담당자 연락처</h3>
                  <div className="space-y-3">
                    {bid.contactName && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <User className="w-4 h-4 text-gray-400" />
                        {bid.contactName}
                      </div>
                    )}
                    {bid.contactEmail && (
                      <a href={`mailto:${bid.contactEmail}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                        <Mail className="w-4 h-4" />
                        {bid.contactEmail}
                      </a>
                    )}
                    {bid.contactPhone && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {bid.contactPhone}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Agency */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-[#111] mb-4 text-sm">발주 기관</h3>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-[#111]">{bid.agency}</div>
                  {bid.office && <div className="text-sm text-gray-500">{bid.office}</div>}
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {bid.placeOfPerformance.city}, {bid.placeOfPerformance.state}, {bid.placeOfPerformance.country}
                  </div>
                </div>
              </div>

              {/* Action */}
              <a
                href={`https://sam.gov/opp/${bid.noticeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#111] text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                SAM.gov에서 전체 공고 보기 <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
