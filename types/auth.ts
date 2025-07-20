export interface AuthCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  success: boolean
  token: string
  expiresIn: number
  tokenType: string
}

export interface AuthError {
  success: false
  error: string
  message?: string
}
