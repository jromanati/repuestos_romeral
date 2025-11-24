"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
  /** id del producto en tu backend */
  id: number
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  color?: string
  /** clave única por variante (mismo producto, distinta talla/color) */
  _key: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity" | "_key"> & { quantity?: number }) => void
  updateQty: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clear: () => void
  count: number
  subtotal: number
}

const CartContext = createContext<CartContextType | null>(null)
const STORAGE_KEY = "cm_cart_v1"

function makeKey(id: number, size?: string, color?: string) {
  return `${id}::${size || ""}::${color || ""}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Hydrate desde localStorage
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  // Persistir cambios
  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem: CartContextType["addItem"] = (item) => {
    const key = makeKey(item.id, item.size, item.color)
    setItems((prev) => {
      const exists = prev.find((i) => i._key === key)
      if (exists) {
        return prev.map((i) =>
          i._key === key ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
        )
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity ?? 1,
          _key: key,
        },
      ]
    })
  }

  const updateQty: CartContextType["updateQty"] = (key, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i._key !== key)
      return prev.map((i) => (i._key === key ? { ...i, quantity } : i))
    })
  }

  const removeItem: CartContextType["removeItem"] = (key) =>
    setItems((prev) => prev.filter((i) => i._key !== key))

  const clear = () => setItems([])

  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((n, i) => n + i.price * i.quantity, 0), [items])

  const value: CartContextType = { items, addItem, updateQty, removeItem, clear, count, subtotal }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>")
  return ctx
}
