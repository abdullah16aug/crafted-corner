import { getPayload } from 'payload'
import config from '@/payload.config'
import { MetadataRoute } from 'next'

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const payload = await getPayload({ config })
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://your-domain.com'

    // Get all products
    const products = await payload.find({
      collection: 'products',
      depth: 0,
    })

    // Get all categories
    const categories = await payload.find({
      collection: 'categories',
      depth: 0,
    })

    // Static routes
    const staticRoutes = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as ChangeFreq,
        priority: 1,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily' as ChangeFreq,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFreq,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFreq,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFreq,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFreq,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/refund-policy`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFreq,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/data-removal`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFreq,
        priority: 0.5,
      },
    ]

    // Product routes
    const productRoutes = products.docs.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date(product.updatedAt || product.createdAt),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 0.8,
    }))

    // Category routes
    const categoryRoutes = categories.docs.map((category) => ({
      url: `${baseUrl}/products?category=${category.id}`,
      lastModified: new Date(category.updatedAt || category.createdAt),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 0.7,
    }))

    return [...staticRoutes, ...productRoutes, ...categoryRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return basic routes if there's an error
    return [
      {
        url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://your-domain.com',
        lastModified: new Date(),
        changeFrequency: 'daily' as ChangeFreq,
        priority: 1,
      },
    ]
  }
}
