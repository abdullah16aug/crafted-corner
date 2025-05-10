import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '8', 10)
    const categoryId = searchParams.get('category') || undefined

    // Initialize Payload
    const payload = await getPayload({ config })

    // Build the query
    const query: any = {
      page,
      limit,
      depth: 1, // Include related data but not too deep
    }

    // Add category filter if provided
    if (categoryId) {
      query.where = {
        category: {
          equals: categoryId,
        },
      }
    }

    // Fetch products with pagination
    const products = await payload.find({
      collection: 'products',
      ...query,
    })

    // Return the paginated products
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
