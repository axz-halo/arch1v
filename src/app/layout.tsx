import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Arch1ve - 음악 큐레이션 플랫폼',
  description: '실시간 음악 공유와 커뮤니티 트렌드를 통한 새로운 음악 발견 플랫폼',
  keywords: ['음악', '큐레이션', '플레이리스트', '소셜', '스포티파이', '음악 공유'],
  authors: [{ name: 'Arch1ve Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff5500',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-surface-50">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
