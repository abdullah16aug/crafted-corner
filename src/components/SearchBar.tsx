'use client'

import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
interface Product {
  id: string
  name: string
  price: number
  image?: { url: string }
  images?: Array<{ image: { url: string } }>
}

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        return
      }

      setIsLoading(true)
      try {
        // Try standard Payload API endpoint pattern
        const response = await fetch(
          `/api/products?where[name][like]=${encodeURIComponent(searchQuery.trim())}&limit=5`,
        )

        if (response.ok) {
          const data = await response.json()
          console.log('Search results:', data)
          setSearchResults(data.docs || [])
        } else {
          console.error('Search request failed with status:', response.status)

          // Log the response for debugging
          try {
            const errorText = await response.text()
            console.error('Error response:', errorText)
          } catch (e) {
            console.error('Could not read error response')
          }

          setSearchResults([])
        }
      } catch (error) {
        console.error('Error fetching search results:', error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchSearchResults, 2000)

    return () => clearTimeout(debounce)
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowResults(false)
    }
  }

  const handleInputFocus = () => {
    if (searchQuery.trim().length >= 2) {
      setShowResults(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowResults(false), 100)
  }

  // For debugging - log when the component renders
  console.log('SearchBar rendering, query:', searchQuery, 'results:', searchResults?.length)

  return (
    <div className="bg-stone-100 py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto relative">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (e.target.value.trim().length >= 2) {
                  setShowResults(true)
                } else {
                  setShowResults(false)
                }
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Search for products..."
              className="w-full py-2 px-4 pr-10 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-500 hover:text-amber-700"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Search results dropdown */}
          {showResults && searchQuery.trim().length >= 2 && (
            <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-stone-200">
              {isLoading ? (
                <div className="p-4 text-center text-stone-500">Loading...</div>
              ) : searchResults && searchResults.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto py-2">
                  {searchResults.map((product) => (
                    <li key={product.id} className="px-4 py-2 hover:bg-stone-50">
                      <Link
                        href={`/products/${product.id}`}
                        className="flex items-center space-x-3"
                        onClick={() => setShowResults(false)}
                      >
                        {/* show image */}
                        {product.images &&
                        product.images.length > 0 &&
                        product.images[0]?.image?.url ? (
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-stone-200">
                            <Image
                              src={product.images[0].image.url}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                        ) : product.image?.url ? (
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-stone-200">
                            <Image
                              src={product.image.url}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-stone-200 bg-stone-100 flex items-center justify-center">
                            <span className="text-stone-400">No img</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-stone-800">{product.name}</p>
                          <p className="text-sm text-amber-700">
                            ₹{product.price?.toFixed(2) || 'N/A'}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-stone-500">No products found</div>
              )}

              {/* Debug info - remove in production */}
              <div className="p-2 border-t border-stone-200 text-xs text-stone-400">
                Query: {searchQuery} | Results: {searchResults ? searchResults.length : 0}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchBar
