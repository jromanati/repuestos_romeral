import { useState } from 'react'
import { ProductService } from "@/services/product.service"
import type { ProductResponse} from "@/types/products"

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
        return response.data 
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
