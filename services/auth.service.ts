import { apiClient, type ApiResponse } from "@/lib/api"
import type { AuthCredentials, AuthResponse } from "@/types/auth"

export class AuthService {
  private static token: string | null = null
  private static tokenExpiry: number | null = null

  static async authenticate(): Promise<ApiResponse<AuthResponse>> {
    // const credentials: AuthCredentials = {
    //   username: process.env.NEXT_PUBLIC_API_USERNAME || "",
    //   password: process.env.NEXT_PUBLIC_API_PASSWORD || "",
    // }
    const credentials: AuthCredentials = {
      username: "repuestosromeral",
      password: "repuestosromeral.2025",
    }

    if (!credentials.username || !credentials.password) {
      return {
        success: false,
        error: "Credenciales de autenticación no configuradas",
      }
    }

    const response = await apiClient.post<AuthResponse>("token/", credentials)

    if (response.success && response.data) {
      this.token = response.data.access
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000

      apiClient.setToken(this.token) // 👈 Asignar token a apiClient

      return response
    }

    return response
  }

  static isTokenValid(): boolean {
    return this.token !== null && this.tokenExpiry !== null && Date.now() < this.tokenExpiry
  }

  static getToken(): string | null {
    return this.isTokenValid() ? this.token : null
  }

  static clearToken(): void {
    this.token = null
    this.tokenExpiry = null
    apiClient.setToken(null) // 👈 Limpiar también en el cliente
  }

  static async getValidToken(): Promise<string | null> {
    if (this.isTokenValid()) {
      return this.token
    }

    const authResponse = await this.authenticate()
    if (authResponse.success && authResponse.data) {
      return authResponse.data.access
    }

    return null
  }
}
