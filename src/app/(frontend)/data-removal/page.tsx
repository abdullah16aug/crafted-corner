import React from 'react'
import { getPageContent } from '@/lib/api'
import { notFound } from 'next/navigation'
import DataRemovalClient from '@/components/data-removal/DataRemovalClient'

// Force dynamic rendering to avoid prerendering issues with client components
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DataRemovalPage() {
  const page = await getPageContent('data-removal')

  if (!page) {
    notFound()
  }

  return <DataRemovalClient page={page} />
}
