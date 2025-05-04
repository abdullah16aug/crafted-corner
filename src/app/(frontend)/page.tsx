import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Product } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  const payload = await getPayload({ config })
  const products = await payload.find({
    collection: 'products',
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.docs.map((product: Product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48">
              {product.images && product.images[0] && (
                <Image
                  src={
                    typeof product.images[0].image === 'object'
                      ? (product.images[0].image as any).url || '/placeholder-image.jpg'
                      : '/placeholder-image.jpg'
                  }
                  alt={product.name || 'Product image'}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                </span>
                <Link
                  href={`/products/${product.id}`}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
