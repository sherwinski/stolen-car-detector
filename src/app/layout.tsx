import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import NavigationBar from '@/components/NavigationBar'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-between px-24 pt-12 gap-4 font-light">
          <NavigationBar />
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  )
}
