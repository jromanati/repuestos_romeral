import { useEffect, useRef, useState } from 'react'
import { mutate } from 'swr'
import { ProductService } from "@/services/product.service"
import type { ProductResponse} from "@/types/products"

export const useCatalogUpdates = () => {
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    // const ws = new WebSocket('ws://base.localhost:8000/ws/catalog/')

    const proto = location.protocol === "https:" ? "wss" : "ws"
    // local
    const ws = new WebSocket(`${proto}://repuestosromeral.localhost:8000/ws/catalog/`)
    // const ws = new WebSocket(`${proto}://comunidadmetal.sitios.softwarelabs.cl/ws/catalog/`)

    ws.onopen = () => {
      console.log('WebSocket conectado ✅')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.event === 'catalog_updated') {
        const now = Date.now()
        if (now - lastUpdateRef.current > 2000) {  // ✅ Solo actualiza cada 2 segundos como mínimo
          lastUpdateRef.current = now
          console.log('🛒 Catálogo actualizado desde backend.')
          mutate('products')
        } else {
          console.log('⏳ Ignorando actualización repetida.')
        }
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('WebSocket cerrado.')
    }

    return () => {
      ws.close()
    }
  }, [])
}

export function useProduct() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getProducts = async (): Promise<ProductResponse | null> => {
    const isAuthenticated = await ProductService.ensureAuthenticated()
    setIsAuthenticating(false)

    if (!isAuthenticated) {
      setError("Error de autenticación del sistema")
      return null
    }
    setIsLoading(true)
    setError(null)

    try {
      const response = await ProductService.getProducts()

      if (response.success && response.data) {
        return response
      } else {
        setError(response.error || "Error al obtener el producto")
        return null
      }
    } catch (err) {
      setError("Error inesperado al obtener la producto")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getProduct = async (productId: number): Promise<ProductResponse | null> => {
    const isAuthenticated = await ProductService.ensureAuthenticated()
    setIsAuthenticating(false)

    if (!isAuthenticated) {
      setError("Error de autenticación del sistema")
      return null
    }
    setIsLoading(true)
    setError(null)

    try {
      const response = await ProductService.getProduct(productId)

      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.error || "Error al obtener el producto")
        return null
      }
    } catch (err) {
      setError("Error inesperado al obtener la orden")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    isAuthenticating,
    error,
    getProducts,
    getProduct,
    clearError: () => setError(null),
  }
}
