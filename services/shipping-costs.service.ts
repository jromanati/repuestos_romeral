import { apiClient, type ApiResponse } from "@/lib/api"
import { AuthService } from "@/services/auth.service"
import type {
  CalculateShippingRequest,
  CalculateShippingResponse,
} from "@/types/shipping"

export class ShippingCostsService {
  private static readonly ENDPOINT = "shipping-costs/calculate/"

  // Calcular costo de envío según región, comuna y total del pedido
  static async calculate(
    data: CalculateShippingRequest,
  ): Promise<ApiResponse<CalculateShippingResponse>> {
    return apiClient.post<CalculateShippingResponse>(this.ENDPOINT, data)
  }

  // Verificar autenticación manualmente si es necesario antes de llamar al endpoint
  static async ensureAuthenticated(): Promise<boolean> {
    const token = await AuthService.getValidToken()
    return token !== null
  }
}
