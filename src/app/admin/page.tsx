'use client';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import { mockUsers, mockLogs } from '@/lib/mockData';
import { User } from '@/types';
import { UserPlus, Shield, Eye, Edit2, ToggleRight, ToggleLeft, RefreshCw, Download, AlertCircle, CheckCircle, Info } from 'lucide-react';

const ROLE_LABELS = { admin: '관리자', manager: '담당자', viewer: '열람자' };
const ROLE_COLORS = {
  admin: 'bg-[#111] text-white',
  manager: 'bg-blue-100 text-blue-700',
  viewer: 'bg-gray-100 text-gray-600',
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [activeTab, setActiveTab] = useState<'users' | 'logs' | 'system'>('users');
  const [collecting, setCollecting] = useState(false);

  function toggleUser(id: string) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  }

  function handleCollect() {
    setCollecting(true);
    setTimeout(() => setCollecting(false), 2500);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="관리자" subtitle="사용자 · 시스템 · 수집 현황 관리" />
      <div className="flex-1 p-8 space-y-6">

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {[
            { id: 'users', label: '사용자 관리' },
            { id: 'logs', label: '수집 로그' },
            { id: 'system', label: '시스템 현황' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-[#111] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">총 {users.length}명 · 활성 {users.filter(u => u.isActive).length}명</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                <UserPlus className="w-4 h-4" /> 사용자 추가
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['이름', '이메일', '부서', '권한', '마지막 로그인', '상태', '관리'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(user => (
                    <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${!user.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#111] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user.name[0]}
                          </div>
                          <span className="text-sm font-medium text-[#111]">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{user.department}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[user.role]}`}>
                          {user.role === 'admin' && <Shield className="w-3 h-3" />}
                          {user.role === 'viewer' && <Eye className="w-3 h-3" />}
                          {ROLE_LABELS[user.role]}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">{user.lastLogin}</td>
                      <td className="px-4 py-4">
                        <button onClick={() => toggleUser(user.id)}>
                          {user.isActive
                            ? <ToggleRight className="w-6 h-6 text-green-500" />
                            : <ToggleLeft className="w-6 h-6 text-gray-300" />
                          }
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">최근 수집 및 시스템 로그</p>
              <div className="flex gap-2">
                <button
                  onClick={handleCollect}
                  className={`flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors ${collecting ? 'bg-gray-100' : 'bg-white'}`}
                >
                  <RefreshCw className={`w-4 h-4 ${collecting ? 'animate-spin text-blue-500' : 'text-gray-500'}`} />
                  {collecting ? '수집 중...' : '즉시 수집 실행'}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-gray-300 transition-colors">
                  <Download className="w-4 h-4 text-gray-500" /> 로그 다운로드
                </button>
              </div>
            </div>

            {collecting && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-blue-900">SAM.gov API 데이터 수집 중...</div>
                  <div className="text-xs text-blue-600 mt-0.5">USFK 관련 키워드로 최신 공고를 스캔합니다</div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {mockLogs.map(log => (
                  <div key={log.id} className="flex items-start gap-4 px-6 py-4">
                    <div className="flex-shrink-0 mt-0.5">
                      {log.level === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      {log.level === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                      {log.level === 'info' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          log.level === 'error' ? 'bg-red-100 text-red-700' :
                          log.level === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-[#111]">{log.message}</span>
                      </div>
                      {log.details && <div className="text-xs text-gray-500 mt-1">{log.details}</div>}
                    </div>
                    <div className="text-xs text-gray-400 flex-shrink-0">{log.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: '수집된 공고 (전체)', value: '1,247건', status: 'normal' },
                { label: '금일 수집', value: '23건', status: 'normal' },
                { label: 'API 응답시간', value: '1.2초', status: 'normal' },
                { label: '스케줄러 상태', value: '정상 실행 중', status: 'normal' },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="text-xs text-gray-400 mb-2">{item.label}</div>
                  <div className="text-xl font-bold text-[#111]">{item.value}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-xs text-green-600">정상</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-[#111] mb-4">수집 설정 현황</h3>
              <div className="space-y-4">
                {[
                  { label: '수집 대상', value: 'SAM.gov Opportunities API v2' },
                  { label: '수집 주기', value: '매 3시간' },
                  { label: '키워드 필터', value: 'USFK, Korea, Camp Humphreys, Osan, Kunsan, 8th Army' },
                  { label: '공고 유형', value: '전체 (Solicitation, Presolicitation, Award, Sources Sought 등)' },
                  { label: '데이터 보존 기간', value: '5년 (낙찰 데이터 포함)' },
                  { label: '마지막 성공 수집', value: '2026-03-24 09:00:01' },
                  { label: '다음 예정 수집', value: '2026-03-24 12:00:00' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-400 w-32 flex-shrink-0">{item.label}</span>
                    <span className="text-sm font-medium text-[#111]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> SAM.gov API 연동 안내
              </h3>
              <div className="space-y-2 text-sm text-white/70">
                <p>• 무료 Public API Key: 분당 10건 요청 제한</p>
                <p>• System Account (유료): 제한 없음, 전체 데이터 접근</p>
                <p>• USFK 관련 공고 수집을 위해 Korea, USFK 등 키워드 기반 검색 수행</p>
                <p>• 낙찰 데이터(Award) 수집을 통해 경쟁사 분석 자동화</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
