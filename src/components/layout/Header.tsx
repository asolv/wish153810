'use client';
import { Bell, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-3 sticky top-0 z-10 lg:top-0">
      <div className="min-w-0">
        <h1 className="text-base md:text-lg font-bold text-[#111] truncate">{title}</h1>
        {subtitle && (
          <p className="text-xs md:text-sm text-gray-400 mt-0.5 truncate hidden sm:block">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="데이터 새로고침"
        >
          <RefreshCw className={`w-4 h-4 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-[#111] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            K
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">김민준</span>
        </div>
      </div>
    </header>
  );
}
