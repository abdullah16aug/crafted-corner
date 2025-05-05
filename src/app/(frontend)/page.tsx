import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Product, Category, Media } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'
// Import the new client component for the grid
import FeaturedProductsClient from '@/components/FeaturedProductsClient'

// Restore revalidate if desired, or leave for on-demand
// export const revalidate = 60

// Make page async again
export default async function Home() {
  const payload = await getPayload({ config })

  // Fetch data server-side
  let products: Product[] = []
  let categories: Category[] = []
  try {
    const [productsData, categoriesData] = await Promise.all([
      payload.find({ collection: 'products', limit: 4, depth: 1 }), // Fetch limited products, maybe add depth: 1 for image url
      payload.find({ collection: 'categories', depth: 0 }),
    ])
    products = productsData.docs
    categories = categoriesData.docs
  } catch (error) {
    console.error('Failed to fetch homepage data:', error)
    // Handle error appropriately, maybe show fewer items or a message
  }

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

        {/* Render the client component for the grid */}
        <FeaturedProductsClient products={products} />
      </div>

      {/* Categories section */}
      <div className="bg-stone-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-semibold text-stone-800 mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category: Category) => (
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
