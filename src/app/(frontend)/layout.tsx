import React from 'react'
import './styles.css'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'

export const metadata = {
  description: 'Crafted Corner - Handmade crafts and unique items',
  title: 'Crafted Corner',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
