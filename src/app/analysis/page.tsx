'use client';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import { mockAwardData, mockCompetitors } from '@/lib/mockData';
import { exportAwardsToExcel, exportCompetitorsToExcel } from '@/lib/excelExport';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { Download, TrendingUp, Trophy, Building2 } from 'lucide-react';

const COLORS = ['#111', '#444', '#777', '#aaa', '#ccc'];

const agencyStats = [
  { agency: 'DLA ENERGY', total: 3, value: 214000000 },
  { agency: 'USACE', total: 5, value: 158000000 },
  { agency: 'DLA TROOP SUPPORT', total: 4, value: 118000000 },
  { agency: 'IMCOM', total: 5, value: 95000000 },
  { agency: 'PACAF', total: 2, value: 21500000 },
].map(d => ({ ...d, valueMil: Math.round(d.value / 1000000) }));

const naicsStats = [
  { code: '424710', desc: '석유제품', value: 214, count: 3 },
  { code: '236220', desc: '건설', value: 137, count: 5 },
  { code: '722310', desc: '급식서비스', value: 98, count: 4 },
  { code: '561612', desc: '경비서비스', value: 67, count: 5 },
  { code: '541512', desc: 'IT서비스', value: 22, count: 2 },
];

const monthlyTrend = mockAwardData.map(d => ({
  month: `${d.month.slice(5)}월`,
  amount: Math.round(d.amount / 1000000),
  agency: d.agency,
}));

const competitorChartData = mockCompetitors.slice(0, 6).map(c => ({
  name: c.name.split(' ')[0],
  fullName: c.name,
  value: Math.round(c.totalValue / 1000000),
  count: c.totalAwards,
}));

function formatValue(val: number) {
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}B`;
  return `$${val}M`;
}

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'awards' | 'competitors'>('overview');

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="데이터 분석" subtitle="과거 낙찰 데이터 기반 시장 분석" />
      <div className="flex-1 p-8 space-y-6">

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {[
            { id: 'overview', label: '개요', icon: TrendingUp },
            { id: 'awards', label: '낙찰 분석', icon: Trophy },
            { id: 'competitors', label: '경쟁사 분석', icon: Building2 },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-[#111] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: '총 낙찰 건수', value: '156건', sub: '2025년 전체', color: 'bg-[#111] text-white' },
                { label: '총 낙찰 금액', value: '$706M', sub: '2025년 전체', color: 'bg-white text-[#111]' },
                { label: '평균 낙찰 금액', value: '$4.5M', sub: '건당 평균', color: 'bg-white text-[#111]' },
                { label: '활성 경쟁사', value: '8개사', sub: '주요 낙찰 업체', color: 'bg-white text-[#111]' },
              ].map(card => (
                <div key={card.label} className={`rounded-xl p-5 border ${card.color === 'bg-[#111] text-white' ? 'bg-[#111] border-transparent' : 'bg-white border-gray-200'}`}>
                  <div className={`text-xs mb-2 ${card.color === 'bg-[#111] text-white' ? 'text-white/50' : 'text-gray-400'}`}>{card.label}</div>
                  <div className={`text-2xl font-bold ${card.color === 'bg-[#111] text-white' ? 'text-white' : 'text-[#111]'}`}>{card.value}</div>
                  <div className={`text-xs mt-1 ${card.color === 'bg-[#111] text-white' ? 'text-white/30' : 'text-gray-400'}`}>{card.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Monthly Trend */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-[#111] mb-1">월별 낙찰 금액</h3>
                <p className="text-sm text-gray-400 mb-5">2025년 월별 낙찰 금액 (백만 달러)</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(v: unknown) => [`$${v as number}M`, '낙찰금액']}
                      contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {monthlyTrend.map((_, i) => (
                        <Cell key={i} fill={i === monthlyTrend.length - 1 ? '#111' : '#e5e7eb'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Agency Distribution */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-[#111] mb-1">기관별 낙찰 금액</h3>
                <p className="text-sm text-gray-400 mb-5">발주 기관별 누계 (백만 달러)</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={agencyStats} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="agency" tick={{ fontSize: 11, fill: '#555' }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip
                      formatter={(v: unknown) => [`$${v as number}M`, '낙찰금액']}
                      contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="valueMil" radius={[0, 4, 4, 0]} fill="#111" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* NAICS Distribution */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-[#111] mb-1">NAICS 코드별 분포</h3>
                <p className="text-sm text-gray-400 mb-5">업종별 낙찰 금액 비중</p>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="50%" height={180}>
                    <PieChart>
                      <Pie data={naicsStats} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                        {naicsStats.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: unknown) => [`$${v as number}M`, '낙찰금액']}
                        contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {naicsStats.map((item, i) => (
                      <div key={item.code} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-700 truncate">{item.desc}</div>
                          <div className="text-xs text-gray-400">{item.code}</div>
                        </div>
                        <div className="text-xs font-semibold text-gray-700">${item.value}M</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Awards Tab */}
        {activeTab === 'awards' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => exportAwardsToExcel(mockAwardData)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-gray-300 transition-colors"
              >
                <Download className="w-4 h-4" /> 엑셀 다운로드
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-[#111]">낙찰 이력 데이터</h3>
                <p className="text-sm text-gray-400 mt-0.5">2025년 USFK 관련 낙찰 기록</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['월', '발주기관', '낙찰업체', '낙찰금액', 'NAICS', '공고명'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockAwardData.map((award, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-600">{award.month}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{award.agency}</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#111]">{award.awardee}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-blue-600">${(award.amount / 1000000).toFixed(1)}M</td>
                        <td className="px-4 py-3 text-xs font-mono text-gray-500">{award.naicsCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{award.title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Competitors Tab */}
        {activeTab === 'competitors' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => exportCompetitorsToExcel(mockCompetitors)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-gray-300 transition-colors"
              >
                <Download className="w-4 h-4" /> 엑셀 다운로드
              </button>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-[#111] mb-1">경쟁사 낙찰 금액 비교</h3>
              <p className="text-sm text-gray-400 mb-5">2025년 주요 경쟁사별 총 낙찰 금액 (백만 달러)</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={competitorChartData} margin={{ top: 5, right: 5, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#555' }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
                    formatter={(v: unknown) => [`$${v as number}M`, '낙찰금액']}
                    contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#111" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-[#111]">경쟁사 상세 분석</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['순위', '업체명', '낙찰 건수', '총 낙찰 금액', '평균 낙찰 금액', '주력 NAICS', '최근 낙찰일'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockCompetitors
                      .sort((a, b) => b.totalValue - a.totalValue)
                      .map((c, i) => (
                        <tr key={c.name} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-500'}`}>
                              {i + 1}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-[#111]">{c.name}</td>
                          <td className="px-4 py-4 text-sm text-gray-700">{c.totalAwards}건</td>
                          <td className="px-4 py-4 text-sm font-bold text-blue-600">${(c.totalValue / 1000000).toFixed(0)}M</td>
                          <td className="px-4 py-4 text-sm text-gray-600">${(c.avgValue / 1000000).toFixed(1)}M</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1">
                              {c.naicsCodes.slice(0, 2).map(code => (
                                <span key={code} className="text-xs font-mono px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{code}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">{c.recentWin || '-'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
