'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, LayoutDashboard, ShoppingBag } from 'lucide-react'
import { CartIndicator } from './CartIndicator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
                <DropdownMenuItem>
                  <Link href="/about" className="flex w-full">
                    About
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/contact" className="flex w-full">
                    Contact
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/admin" className="flex w-full items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin</span>
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
