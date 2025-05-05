'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { CartIndicator } from './CartIndicator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

// Placeholder hook - Replace with your actual auth logic
// This should likely fetch user status from Payload context or similar
const useAuth = () => {
  // Replace with real logic, maybe checking a cookie or context
  const [user, setUser] = useState<{ email?: string } | null>(null) // Example: null or { email: '...' }
  const [isLoading, setIsLoading] = useState(true)

  // Simulate fetching user state
  React.useEffect(() => {
    // In a real app, check auth status here (e.g., fetch '/api/users/me')
    // For now, let's assume logged out initially after a delay
    const timer = setTimeout(() => {
      // setUser({ email: 'test@example.com' }); // Simulate logged in
      setUser(null) // Simulate logged out
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const logout = async () => {
    // Call your logout API endpoint here
    console.log('Logging out...')
    // Example: await fetch('/api/users/logout', { method: 'POST' });
    setUser(null) // Update state
  }

  return { user, isLoading, logout }
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

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
          <div className="hidden sm:flex items-center space-x-4">
            <CartIndicator />

            {/* Conditional User Icon/Login */}
            {isLoading ? (
              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5 text-stone-600 hover:text-amber-800" />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      {user.email && (
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <CartIndicator />
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
            {user ? (
              <>
                <Link
                  href="/admin"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-stone-600 hover:bg-stone-100 hover:border-amber-500 hover:text-amber-800"
                >
                  Admin
                </Link>
                <button
                  onClick={async () => {
                    await logout()
                    toggleMenu()
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-stone-600 hover:bg-stone-100 hover:border-amber-500 hover:text-amber-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-stone-600 hover:bg-stone-100 hover:border-amber-500 hover:text-amber-800"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
