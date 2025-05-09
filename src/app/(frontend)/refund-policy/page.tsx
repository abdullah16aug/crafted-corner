import React from 'react'
import { getPageContent } from '@/lib/api'
import { notFound } from 'next/navigation'
import RefundPolicyClient from '@/components/refund-policy/RefundPolicyClient'

// Force dynamic rendering to avoid prerendering issues with client components
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RefundPolicyPage() {
  const page = await getPageContent('refund-policy')

  if (!page) {
    notFound()
  }

  return <RefundPolicyClient page={page} />
}
