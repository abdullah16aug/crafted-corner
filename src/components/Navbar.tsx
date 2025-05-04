'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingBag, User } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-stone-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-serif font-bold text-xl text-amber-800">
                Crafted Corner
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-amber-700 text-sm font-medium text-amber-900"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-stone-600 hover:text-amber-800 hover:border-amber-500"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-stone-600 hover:text-amber-800 hover:border-amber-500"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right side icons */}
          <div className="hidden sm:flex items-center">
            <Link href="/cart" className="p-2 text-stone-600 hover:text-amber-800">
              <ShoppingBag className="h-6 w-6" />
            </Link>
            <Link href="/admin" className="p-2 text-stone-600 hover:text-amber-800 ml-4">
              <User className="h-6 w-6" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Link href="/cart" className="p-2 text-stone-600 hover:text-amber-800 mr-2">
              <ShoppingBag className="h-6 w-6" />
            </Link>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-stone-600 hover:text-amber-800 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-stone-50">
            <Link
              href="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-amber-700 text-base font-medium text-amber-900 bg-amber-50"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-stone-600 hover:bg-stone-100 hover:border-amber-500 hover:text-amber-800"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-stone-600 hover:bg-stone-100 hover:border-amber-500 hover:text-amber-800"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-stone-600 hover:bg-stone-100 hover:border-amber-500 hover:text-amber-800"
            >
              Contact
            </Link>
            <Link
              href="/admin"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-stone-600 hover:bg-stone-100 hover:border-amber-500 hover:text-amber-800"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
