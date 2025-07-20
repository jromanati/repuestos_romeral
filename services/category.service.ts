import { apiClient, type ApiResponse } from "@/lib/api"
import { AuthService } from "@/services/auth.service"

export interface Category {
  id: number
  name: string,
  subcategories?: Category[]
}


export class CategoryService {
  // Obtener todos los productos con filtros
  static async getCategories(): Promise<ApiResponse<Category>> {
    const params = new URLSearchParams({
      ...Object.entries({}).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            acc[key] = value.toString()
          }
          return acc
        },
        {} as Record<string, string>,
      ),
    })
    return apiClient.get<Category>(`categories`)
  }
  static async ensureAuthenticated(): Promise<boolean> {
    const token = await AuthService.getValidToken()
    return token !== null
  }
}
