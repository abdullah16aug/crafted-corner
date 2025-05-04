import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Product, Category } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  const payload = await getPayload({ config })

  // Fetch products
  const products = await payload.find({
    collection: 'products',
  })

  // Fetch categories
  const categories = await payload.find({
    collection: 'categories',
  })

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero section */}
      <div className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4">
              Handcrafted with Love
            </h1>
            <p className="text-lg text-stone-700 mb-8">
              Discover unique home decor pieces that add warmth and character to your space
            </p>
            <Link
              href="/products"
              className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Featured products section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-2xl font-serif font-semibold text-stone-800">Featured Products</h2>
          <Link
            href="/products"
            className="text-amber-700 hover:text-amber-900 font-medium text-sm"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {products.docs.slice(0, 4).map((product: Product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="relative h-32 xs:h-40 sm:h-48 overflow-hidden">
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
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-3 xs:p-4">
                <h3 className="text-sm xs:text-base font-medium text-stone-800 mb-1">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-amber-800 font-semibold text-xs xs:text-sm">
                    ₹{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                  </span>
                  <Link
                    href={`/products/${product.id}`}
                    className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 py-1 px-2 xs:px-3 rounded-md transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories section */}
      <div className="bg-stone-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-semibold text-stone-800 mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.docs.map((category: Category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-700 text-xl">{getCategoryIcon(category.name)}</span>
                </div>
                <h3 className="font-medium text-stone-800">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* About section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-serif font-semibold text-stone-800 mb-4">Our Story</h2>
          <p className="text-stone-700 mb-6">
            Crafted Corner was founded with a simple mission: to bring unique, handcrafted items to
            people who appreciate quality craftsmanship and attention to detail.
          </p>
          <Link
            href="/about"
            className="inline-block text-amber-700 hover:text-amber-900 font-medium border-b border-amber-700"
          >
            Learn more about us
          </Link>
        </div>
      </div>
    </div>
  )
}

// Helper function to get an appropriate icon for each category
function getCategoryIcon(categoryName?: string): string {
  if (!categoryName) return '✧'

  const name = categoryName.toLowerCase()

  if (name.includes('decor')) return '✧'
  if (name.includes('furniture')) return '⌂'
  if (name.includes('textile') || name.includes('fabric')) return '≋'
  if (name.includes('light')) return '✺'
  if (name.includes('kitchen')) return '♨'
  if (name.includes('bath')) return '♒'
  if (name.includes('outdoor')) return '⚘'
  if (name.includes('art')) return '♠'

  // Default icon
  return '✧'
}
