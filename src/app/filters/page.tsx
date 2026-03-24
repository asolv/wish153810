'use client';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import { FilterConfig } from '@/types';
import { Plus, Trash2, Edit2, Bell, Mail, MessageSquare, Check, X, ToggleLeft, ToggleRight } from 'lucide-react';

const defaultFilters: FilterConfig[] = [
  {
    id: '1',
    name: 'USFK 시설관리',
    keywords: ['Camp Humphreys', 'base operations', 'facilities', 'maintenance'],
    naicsCodes: ['561210', '561499', '238220'],
    agencies: ['IMCOM', 'DLA TROOP SUPPORT'],
    noticeTypes: ['Solicitation', 'Presolicitation'],
    isActive: true,
    alertEmail: true,
    alertSms: true,
    alertSlack: false,
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    name: '건설 공사',
    keywords: ['construction', 'renovation', 'barracks', 'facility'],
    naicsCodes: ['236220', '236118', '237310'],
    agencies: ['USACE'],
    noticeTypes: ['Solicitation', 'Sources Sought'],
    minValue: 5000000,
    isActive: true,
    alertEmail: true,
    alertSms: false,
    alertSlack: true,
    createdAt: '2026-01-20',
  },
  {
    id: '3',
    name: 'IT/사이버보안',
    keywords: ['IT', 'network', 'cybersecurity', 'information technology'],
    naicsCodes: ['541512', '541511', '541519'],
    agencies: [],
    noticeTypes: ['Solicitation', 'Presolicitation', 'Sources Sought'],
    isActive: false,
    alertEmail: true,
    alertSms: false,
    alertSlack: false,
    createdAt: '2026-02-10',
  },
];

const NOTICE_TYPE_OPTIONS = ['Solicitation', 'Presolicitation', 'Award Notice', 'Sources Sought', 'Combined Synopsis/Solicitation'];
const AGENCY_OPTIONS = ['IMCOM', 'DLA TROOP SUPPORT', 'DLA ENERGY', 'USACE', 'PACAF', 'USFK', '8TH ARMY'];

export default function FiltersPage() {
  const [filters, setFilters] = useState<FilterConfig[]>(defaultFilters);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [apiSettings, setApiSettings] = useState({
    samApiKey: '',
    collectInterval: 3,
    emailRecipients: ['minjun.kim@company.co.kr', 'seoyeon.lee@company.co.kr'],
    smsRecipients: ['010-1234-5678'],
    slackWebhook: 'https://hooks.slack.com/services/...',
    testEmail: '',
  });
  const [newEmail, setNewEmail] = useState('');
  const [newSms, setNewSms] = useState('');
  const [saved, setSaved] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'filters' | 'notification' | 'api'>('filters');

  function toggleFilter(id: string) {
    setFilters(prev => prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
  }
  function deleteFilter(id: string) {
    setFilters(prev => prev.filter(f => f.id !== id));
  }
  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="필터 · 알림 설정" subtitle="맞춤 입찰 조건 및 알림 채널 관리" />
      <div className="flex-1 p-8 space-y-6">

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {[
            { id: 'filters', label: '필터 설정' },
            { id: 'notification', label: '알림 설정' },
            { id: 'api', label: 'API 설정' },
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

        {/* Filters Tab */}
        {activeTab === 'filters' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">조건에 맞는 공고가 수집되면 즉시 알림을 발송합니다.</p>
              <button
                onClick={() => setShowNewForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> 새 필터 추가
              </button>
            </div>

            {/* New Filter Form */}
            {showNewForm && (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6">
                <h3 className="font-semibold text-[#111] mb-4">새 필터 만들기</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">필터 이름</label>
                    <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="예: 급식 서비스" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">키워드 (쉼표로 구분)</label>
                    <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="예: food service, dining, catering" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">NAICS 코드 (쉼표로 구분)</label>
                    <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="예: 722310, 722320" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">최소 금액 (USD)</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="예: 1000000" />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setShowNewForm(false)}
                    className="px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                  >
                    저장하기
                  </button>
                  <button onClick={() => setShowNewForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">
                    취소
                  </button>
                </div>
              </div>
            )}

            {filters.map((filter) => (
              <div key={filter.id} className={`bg-white rounded-xl border p-6 transition-all ${filter.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <button onClick={() => toggleFilter(filter.id)} className="mt-0.5">
                      {filter.isActive
                        ? <ToggleRight className="w-6 h-6 text-[#111]" />
                        : <ToggleLeft className="w-6 h-6 text-gray-400" />
                      }
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-[#111]">{filter.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${filter.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {filter.isActive ? '활성' : '비활성'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs font-medium text-gray-400 mb-1.5">키워드</div>
                          <div className="flex flex-wrap gap-1">
                            {filter.keywords.map(k => (
                              <span key={k} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">{k}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-400 mb-1.5">NAICS 코드</div>
                          <div className="flex flex-wrap gap-1">
                            {filter.naicsCodes.map(c => (
                              <span key={c} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-mono rounded">{c}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-400 mb-1.5">알림 채널</div>
                          <div className="flex gap-2">
                            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${filter.alertEmail ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                              <Mail className="w-3 h-3" /> 이메일
                            </span>
                            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${filter.alertSms ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                              <MessageSquare className="w-3 h-3" /> SMS
                            </span>
                            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${filter.alertSlack ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
                              <Bell className="w-3 h-3" /> Slack
                            </span>
                          </div>
                        </div>
                      </div>

                      {filter.agencies.length > 0 && (
                        <div className="mt-3">
                          <span className="text-xs text-gray-400">대상 기관: </span>
                          {filter.agencies.map(a => (
                            <span key={a} className="text-xs text-gray-600 mr-2">{a}</span>
                          ))}
                        </div>
                      )}
                      {filter.minValue && (
                        <div className="mt-1">
                          <span className="text-xs text-gray-400">최소 금액: </span>
                          <span className="text-xs font-medium text-gray-600">${filter.minValue.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="편집">
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => deleteFilter(filter.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="삭제">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification Tab */}
        {activeTab === 'notification' && (
          <div className="space-y-6 max-w-2xl">
            {/* Email */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-[#111]">이메일 알림</h3>
              </div>
              <div className="space-y-2 mb-4">
                {apiSettings.emailRecipients.map((email) => (
                  <div key={email} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{email}</span>
                    <button
                      onClick={() => setApiSettings(prev => ({ ...prev, emailRecipients: prev.emailRecipients.filter(e => e !== email) }))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="이메일 주소 추가"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
                <button
                  onClick={() => { if (newEmail) { setApiSettings(prev => ({ ...prev, emailRecipients: [...prev.emailRecipients, newEmail] })); setNewEmail(''); } }}
                  className="px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium"
                >
                  추가
                </button>
              </div>
            </div>

            {/* SMS */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-[#111]">SMS 알림</h3>
              </div>
              <div className="space-y-2 mb-4">
                {apiSettings.smsRecipients.map((phone) => (
                  <div key={phone} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{phone}</span>
                    <button
                      onClick={() => setApiSettings(prev => ({ ...prev, smsRecipients: prev.smsRecipients.filter(p => p !== phone) }))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newSms}
                  onChange={e => setNewSms(e.target.value)}
                  placeholder="전화번호 추가 (예: 010-0000-0000)"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
                <button
                  onClick={() => { if (newSms) { setApiSettings(prev => ({ ...prev, smsRecipients: [...prev.smsRecipients, newSms] })); setNewSms(''); } }}
                  className="px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium"
                >
                  추가
                </button>
              </div>
            </div>

            {/* Slack */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-[#111]">Slack 웹훅</h3>
              </div>
              <input
                value={apiSettings.slackWebhook}
                onChange={e => setApiSettings(prev => ({ ...prev, slackWebhook: e.target.value }))}
                placeholder="Slack Incoming Webhook URL"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 font-mono"
              />
            </div>

            {/* Alert Schedule */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-[#111] mb-4">알림 스케줄</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '즉시', sub: '공고 수집 즉시', value: 0 },
                  { label: '1시간', sub: '1시간마다 묶음', value: 1 },
                  { label: '1일 1회', sub: '매일 오전 9시', value: 24 },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setApiSettings(prev => ({ ...prev, collectInterval: opt.value || 3 }))}
                    className={`p-4 rounded-xl border text-left transition-all ${apiSettings.collectInterval === (opt.value || 3) ? 'border-[#111] bg-[#111] text-white' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className={`font-semibold text-sm ${apiSettings.collectInterval === (opt.value || 3) ? 'text-white' : 'text-[#111]'}`}>{opt.label}</div>
                    <div className={`text-xs mt-1 ${apiSettings.collectInterval === (opt.value || 3) ? 'text-white/60' : 'text-gray-400'}`}>{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-[#111] text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
              {saved ? <><Check className="w-4 h-4" /> 저장 완료</> : '설정 저장'}
            </button>
          </div>
        )}

        {/* API Tab */}
        {activeTab === 'api' && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <strong>SAM.gov API 키 발급:</strong> beta.sam.gov에서 계정 생성 후 System Account를 통해 Public API Key를 발급받으세요.
              발급된 키를 아래에 입력하면 실제 데이터가 수집됩니다.
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h3 className="font-semibold text-[#111]">SAM.gov API 연결 설정</h3>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">API Key</label>
                <div className="flex gap-2">
                  <input
                    type={apiKeyVisible ? 'text' : 'password'}
                    value={apiSettings.samApiKey}
                    onChange={e => setApiSettings(prev => ({ ...prev, samApiKey: e.target.value }))}
                    placeholder="SAM.gov Public API Key 입력"
                    className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                  <button
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50"
                  >
                    {apiKeyVisible ? '숨기기' : '보기'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">수집 주기</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={apiSettings.collectInterval}
                    onChange={e => setApiSettings(prev => ({ ...prev, collectInterval: Number(e.target.value) }))}
                    className="flex-1 accent-black"
                  />
                  <span className="text-sm font-semibold text-[#111] w-16">매 {apiSettings.collectInterval}시간</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                  {saved ? <><Check className="w-4 h-4" /> 저장됨</> : '저장 및 연결 테스트'}
                </button>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-sm text-gray-600">현재 상태: <strong>데모 모드</strong> (Mock 데이터 사용 중)</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">API Key 입력 후 저장 시 실제 SAM.gov 데이터로 전환됩니다.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
