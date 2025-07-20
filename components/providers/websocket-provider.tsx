// components/providers/WebSocketProvider.tsx
"use client"

import { ReactNode, useEffect, useRef } from "react"
import { mutate } from "swr"

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    const ws = new WebSocket('ws://base.localhost:8000/ws/catalog/')

    ws.onopen = () => console.log('WebSocket conectado ✅')

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.event === 'catalog_updated') {
        mutate('products')
      }
    }

    ws.onerror = (error) => console.error('WebSocket error:', error)
    ws.onclose = () => console.log('WebSocket cerrado.')

    return () => ws.close()
  }, [])

  return <>{children}</>
}
