'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, ChevronDown } from 'lucide-react'
import { CartIndicator } from './CartIndicator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const Navbar = () => {
  return (
    <nav className="bg-stone-50 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-serif font-bold text-xl text-amber-800">
                Krafted Korner
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

              {/* Policies Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-stone-600 hover:text-amber-800 hover:border-amber-500">
                    Policies <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" sideOffset={8} className="bg-white">
                  <DropdownMenuItem>
                    <Link href="/terms" className="flex w-full">
                      Terms & Conditions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/privacy-policy" className="flex w-full">
                      Privacy Policy
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/refund-policy" className="flex w-full">
                      Refund Policy
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/data-removal" className="flex w-full">
                      Data Removal
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <CartIndicator />

            {/* Mini dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full p-0">
                  <Menu className="h-5 w-5 text-stone-600 hover:text-amber-800" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="bg-white">
                <DropdownMenuItem>
                  <Link href="/" className="flex w-full">
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/products" className="flex w-full">
                    Products
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
