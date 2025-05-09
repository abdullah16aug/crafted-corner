import React from 'react'

// Import the client-side cart component
import CartClient from '@/components/cart/CartClient'

// Force dynamic rendering to avoid prerendering issues with client components
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function CartPage() {
  return <CartClient />
}
