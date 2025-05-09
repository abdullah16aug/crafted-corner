import React from 'react'
import { getPageContent } from '@/lib/api'
import { notFound } from 'next/navigation'
import AboutClient from '@/components/about/AboutClient'

// Force dynamic rendering to avoid prerendering issues with client components
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AboutPage() {
  const page = await getPageContent('about')

  if (!page) {
    notFound()
  }

  return <AboutClient page={page} />
}
