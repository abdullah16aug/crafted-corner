import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Product } from '@/payload-types'
// Import the new client component we will create
import ProductDetailsClient from '@/components/ProductDetailsClient'

// Restore revalidate if needed, or keep it removed for on-demand
// export const revalidate = 60

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
// Restore metadata generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const awaitedParams = await params // Await the params promise
  const { id } = awaitedParams // Destructure id from the resolved params
  const payload = await getPayload({ config })
  let product: Product | null = null
  try {
    product = await payload.findByID({
      collection: 'products',
      id: id,
    })
  } catch (_error) {
    // Handle error case for metadata
  }
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }
  return {
    title: `${product.name} | Crafted Corner`,
    description: product.description?.substring(0, 160) || 'Product details',
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params // Await the params promise
  const { id } = awaitedParams // Destructure id from the resolved params
  const payload = await getPayload({ config })
  let product: Product | null = null

  try {
    // Fetch product server-side
    product = await payload.findByID({
      collection: 'products',
      id,
    })
  } catch (_error) {
    // Error fetching product, trigger notFound()
    console.error('Server-side fetch error:', _error)
    notFound()
  }

  // If product fetch returns null/undefined or failed, trigger notFound()
  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/products"
        className="inline-flex items-center text-amber-700 hover:text-amber-800 mb-6"
      >
        ← Back to Products
      </Link>

      {/* Render the client component, passing product data */}
      <ProductDetailsClient product={product} />
    </div>
  )
}
