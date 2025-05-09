import React from 'react'
import { getPageContent } from '@/lib/api'
import { notFound } from 'next/navigation'
import TermsClient from '@/components/terms/TermsClient'

// Force dynamic rendering to avoid prerendering issues with client components
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function TermsPage() {
  const page = await getPageContent('terms')

  if (!page) {
    notFound()
  }

  return <TermsClient page={page} />
}
