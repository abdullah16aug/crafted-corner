import React from 'react'
import { getPageContent } from '@/lib/api'
import { notFound } from 'next/navigation'
import ContactClient from '@/components/contact/ContactClient'

// Force dynamic rendering to avoid prerendering issues with client components
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ContactPage() {
  const page = await getPageContent('contact')

  if (!page) {
    notFound()
  }

  return <ContactClient page={page} />
}
