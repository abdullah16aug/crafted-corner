import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Product, Media } from '../../../../payload-types'

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props) {
  const payload = await getPayload({ config })
  let product

  try {
    product = await payload.findByID({
      collection: 'products',
      id: params.id,
    })
  } catch (error) {
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

export default async function ProductPage({ params }: Props) {
  const payload = await getPayload({ config })
  let product

  try {
    product = await payload.findByID({
      collection: 'products',
      id: params.id,
    })
  } catch (error) {
    notFound()
  }

  // Get related products from the same category
  let relatedProducts: Product[] = []
  try {
    const relatedResult = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            category: {
              equals: typeof product.category === 'object' ? product.category.id : product.category,
            },
          },
          {
            id: {
              not_equals: product.id,
            },
          },
        ],
      },
      limit: 3,
    })
    relatedProducts = relatedResult.docs
  } catch (error) {
    console.error('Failed to fetch related products:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/products"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
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
                      ? (product.images[0].image as Media).url || '/placeholder-image.jpg'
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

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  {relatedProduct.images && relatedProduct.images[0] && (
                    <Image
                      src={
                        typeof relatedProduct.images[0].image === 'object'
                          ? (relatedProduct.images[0].image as Media).url ||
                            '/placeholder-image.jpg'
                          : '/placeholder-image.jpg'
                      }
                      alt={relatedProduct.name || 'Product image'}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{relatedProduct.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-bold">
                      $
                      {typeof relatedProduct.price === 'number'
                        ? relatedProduct.price.toFixed(2)
                        : '0.00'}
                    </span>
                    <Link
                      href={`/products/${relatedProduct.id}`}
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
      )}
    </div>
  )
}
