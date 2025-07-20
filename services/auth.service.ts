import { apiClient, type ApiResponse } from "@/lib/api"
import type { AuthCredentials, AuthResponse } from "@/types/auth"

export class AuthService {
  private static token: string | null = null
  private static tokenExpiry: number | null = null

  // Autenticar usando credenciales del sistema
  static async authenticate(): Promise<ApiResponse<AuthResponse>> {
    const credentials: AuthCredentials = {
      username: process.env.NEXT_PUBLIC_API_USERNAME || "",
      password: process.env.NEXT_PUBLIC_API_PASSWORD || "",
    }

    if (!credentials.username || !credentials.password) {
      return {
        success: false,
        error: "Credenciales de autenticación no configuradas",
      }
    }

    try {
      const response = await apiClient.post<AuthResponse>("token/", credentials)
      console.log("Respuesta de autenticación:", response.data)

      if (response.success && response.data) {
        // Guardar token y tiempo de expiración
        this.token = response.data.token
        this.tokenExpiry = Date.now() + response.data.expiresIn * 1000

        return response
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de autenticación",
      }
    }
  }

  // Verificar si el token es válido
  static isTokenValid(): boolean {
    return this.token !== null && this.tokenExpiry !== null && Date.now() < this.tokenExpiry
  }

  // Obtener token actual
  static getToken(): string | null {
    return this.isTokenValid() ? this.token : null
  }

  // Limpiar token
  static clearToken(): void {
    this.token = null
    this.tokenExpiry = null
  }

  // Obtener token válido (autentica si es necesario)
  static async getValidToken(): Promise<string | null> {
    if (this.isTokenValid()) {
      return this.token
    }

    // Token expirado o no existe, autenticar nuevamente
    const authResponse = await this.authenticate()

    if (authResponse.success && authResponse.data) {
      return authResponse.data.token
    }

    return null
  }
}
