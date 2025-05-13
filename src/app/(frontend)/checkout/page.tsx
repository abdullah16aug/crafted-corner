import React from 'react'

// Import the client-side checkout component
import CheckoutClient from '@/components/checkout/CheckoutClient'

// Force dynamic rendering to avoid prerendering issues with client components
export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  return <CheckoutClient />
}
