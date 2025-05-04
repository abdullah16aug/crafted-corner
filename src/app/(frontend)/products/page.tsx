import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Product, Media } from '@/payload-types'

const payload = await getPayload({ config })
export const metadata = {
  title: 'Products | Crafted Corner',
  description: 'Browse our handcrafted products',
}
const products = await payload.find({
  collection: 'products',
  limit: 10,
})
console.log(products)
// Mock product data - in a real app, this would come from your API/database

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.docs.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-64">
              {product.images && product.images[0] && (
                <Image
                  src={
                    typeof product.images[0].image === 'object'
                      ? (product.images[0].image as Media).url || '/placeholder-image.jpg'
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
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
