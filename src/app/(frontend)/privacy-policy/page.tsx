import React from 'react'
import { getPageContent } from '@/lib/api'
import { notFound } from 'next/navigation'
import PrivacyPolicyClient from '@/components/privacy-policy/PrivacyPolicyClient'

// Force dynamic rendering to avoid prerendering issues with client components
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PrivacyPolicyPage() {
  const page = await getPageContent('privacy-policy')

  if (!page) {
    notFound()
  }

  return <PrivacyPolicyClient page={page} />
}
