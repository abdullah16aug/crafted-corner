import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product } from '@/payload-types' // Assuming your Payload types are here

// Define the structure for an item in the cart
export interface CartItem {
  product: Product // Store the whole product for simplicity, adjust if needed
  quantity: number
}

// Define the state structure for the cart store
interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  clearCart: () => void
}

// Create the Zustand store with persistence
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Add item to cart ONLY if it does not already exist
      addItem: (product) => {
        const currentItems = get().items
        const existingItemIndex = currentItems.findIndex((item) => item.product.id === product.id)

        if (existingItemIndex === -1) {
          // Product doesn't exist, add with quantity 1
          // Optional: Check inventory before adding
          // if (product.inventory > 0) {
          set({ items: [...currentItems, { product, quantity: 1 }] })
          // }
        } else {
          // Product already exists, do nothing (or maybe show a toast?)
          console.log(`Product ${product.id} already in cart.`)
          // Optionally, trigger a toast notification here to inform the user
        }
      },

      // Remove item entirely from cart
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) })
      },

      // Increase quantity of a specific item
      increaseQuantity: (productId) => {
        set({
          items: get().items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity + 1 } // Optional: Check inventory
              : item,
          ),
        })
      },

      // Decrease quantity or remove if quantity reaches 0
      decreaseQuantity: (productId) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.product.id === productId)

        if (existingItem && existingItem.quantity > 1) {
          set({
            items: currentItems.map((item) =>
              item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
            ),
          })
        } else {
          // Remove item if quantity is 1 or less
          get().removeItem(productId)
        }
      },

      // Clear all items from the cart
      clearCart: () => {
        set({ items: [] })
      },
    }),
    {
      name: 'cart-storage', // Name of the item in storage (must be unique)
      storage: createJSONStorage(() => localStorage), // Use localStorage
    },
  ),
)
