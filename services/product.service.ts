import { apiClient, type ApiResponse } from "@/lib/api"
import { AuthService } from "@/services/auth.service"

export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  brand: string
  model: string
  sku: string
  images: string[]
  inStock: boolean
  stockQuantity: number
  rating: number
  reviews: number
  features: string[]
  specifications: Record<string, string>
  compatibility: string[]
}

export interface ProductFilters {
  category?: string
  brand?: string
  model?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

import type { ProductResponse} from "@/types/products"

export class ProductService {
  // Obtener todos los productos con filtros
  static async getProducts(filters: ProductFilters = {}, page = 1, limit = 20): Promise<ApiResponse<ProductResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.entries(filters).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            acc[key] = value.toString()
          }
          return acc
        },
        {} as Record<string, string>,
      ),
    })
    return apiClient.get<ProductResponse>(`catalog`)
  }

  // Obtener producto por ID
  static async getProduct(id: number): Promise<ApiResponse<ProductResponse>> {
    return apiClient.get<ProductResponse>(`products/${id}/update`)
  }

  // Buscar productos
  static async searchProducts(query: string, limit = 10): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
    })

    return apiClient.get<Product[]>(`/products/search?${params}`)
  }

  // Obtener productos relacionados
  static async getRelatedProducts(productId: number, limit = 4): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(`/products/${productId}/related?limit=${limit}`)
  }

  // Obtener productos destacados
  static async getFeaturedProducts(limit = 8): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(`/products/featured?limit=${limit}`)
  }

  // Verificar stock de un producto
  static async checkStock(
    productId: number,
    quantity = 1,
  ): Promise<ApiResponse<{ available: boolean; stock: number }>> {
    return apiClient.get<{ available: boolean; stock: number }>(`/products/${productId}/stock?quantity=${quantity}`)
  }

  static async ensureAuthenticated(): Promise<boolean> {
    const token = await AuthService.getValidToken()
    return token !== null
  }
}
