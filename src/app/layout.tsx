import type { Metadata, Viewport } from 'next';
import './globals.css';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

export const metadata: Metadata = {
  title: 'USFK BidTrack - 미군 입찰 정보 시스템',
  description: 'SAM.gov API 연동 주한미군(USFK) 입찰 정보 자동 수집 및 분석 플랫폼',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
