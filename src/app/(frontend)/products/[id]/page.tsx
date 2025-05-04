import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Product } from '@/payload-types'

interface ImageObject {
  url: string
  [key: string]: any
}

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { id } = await params
  const payload = await getPayload({ config })
  let product: Product | null = null

  try {
    product = await payload.findByID({
      collection: 'products',
      id: id,
    })
  } catch (_error) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
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

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const payload = await getPayload({ config })
  let product: Product | null = null

  try {
    product = await payload.findByID({
      collection: 'products',
      id,
    })
  } catch (_error) {
    notFound()
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        ← Back to Products
      </Link>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* Product image */}
          <div className="md:w-1/2">
            <div className="relative h-96 md:h-full">
              {product.images && product.images[0] && (
                <Image
                  src={
                    typeof product.images[0].image === 'object'
                      ? (product.images[0].image as ImageObject).url || '/placeholder-image.jpg'
                      : '/placeholder-image.jpg'
                  }
                  alt={product.name || 'Product image'}
                  fill
                  priority
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="md:w-1/2 p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-4">
              Category: {typeof product.category === 'object' ? product.category.name : 'Unknown'}
            </p>

            <div className="text-2xl font-bold text-blue-600 mb-6">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-2">Product Details:</h2>
              <p className="text-gray-700">SKU: {product.sku}</p>
            </div>

            <div className="mb-6">
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold ${product.inventory > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-full`}
              >
                {product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <button
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded ${product.inventory <= 0 && 'opacity-50 cursor-not-allowed'}`}
              disabled={product.inventory <= 0}
            >
              {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
