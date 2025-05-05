'use client' // Required for hook

import React from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react' // Example icon
import { useCartStore } from '@/store/cartStore'

export function CartIndicator() {
  // Get items directly for count calculation
  const items = useCartStore((state) => state.items)
  // Use a selector to prevent unnecessary re-renders if only count is needed
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Avoid hydration mismatch by rendering count only client-side
  const [isClient, setIsClient] = React.useState(false)
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Link
      href="/cart"
      className="relative flex items-center group p-2 text-stone-600 hover:text-amber-800"
    >
      <ShoppingBag className="h-6 w-6" />
      {isClient && totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs font-medium text-white">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
