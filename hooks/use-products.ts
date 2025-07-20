import { useEffect, useRef } from 'react'
import { mutate } from 'swr'

export const useCatalogUpdates = () => {
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    const ws = new WebSocket('ws://base.localhost:8000/ws/catalog/')

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
