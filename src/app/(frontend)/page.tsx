import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Product, Category } from '@/payload-types'
import HomeClient from '@/components/home/HomeClient'
import { Metadata } from 'next'

// Force dynamic rendering to avoid prerendering issues with client components
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Krafted Korner - Handcrafted Home Decor',
  description:
    'Discover unique handcrafted home decor pieces that add warmth and character to your space. Shop our collection of artisanal products.',
  keywords: 'handcrafted, home decor, artisan, handmade, furniture, decor, crafts',
  openGraph: {
    title: 'Krafted Korner - Handcrafted Home Decor',
    description:
      'Discover unique handcrafted home decor pieces that add warmth and character to your space.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Krafted Korner',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krafted Korner - Handcrafted Home Decor',
    description:
      'Discover unique handcrafted home decor pieces that add warmth and character to your space.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function Home() {
  const payload = await getPayload({ config })

  // Fetch data server-side
  let featuredProducts: Product[] = []
  let categories: Category[] = []
  try {
    const [productsData, categoriesData] = await Promise.all([
      payload.find({
        collection: 'products',
        where: {
          and: [{ featured: { equals: true } }, { status: { equals: 'published' } }],
        },
        limit: 8,
        depth: 1,
      }),
      payload.find({ collection: 'categories', depth: 2 }),
    ])
    featuredProducts = productsData.docs
    categories = categoriesData.docs
  } catch (error) {
    console.error('Failed to fetch homepage data:', error)
    // Handle error appropriately, maybe show fewer items or a message
  }

  return <HomeClient products={featuredProducts} categories={categories} />
}
