"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CatalogPdfDownloadButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")

      const headers: HeadersInit = {}
      if (token) headers.Authorization = `Bearer ${token}`

      const resp = await fetch("/api/catalog/pdf", {
        method: "GET",
        headers,
      })

      if (!resp.ok) {
        const text = await resp.text().catch(() => "")
        throw new Error(text || `HTTP ${resp.status}`)
      }

      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `catalogo-repuestos-romeral-${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="hidden lg:flex hover:bg-red-50 hover:text-red-600"
      onClick={handleDownload}
      disabled={isLoading}
      aria-label="Descargar catálogo PDF"
    >
      <Download className="w-4 h-4 mr-2" />
      {isLoading ? "Descargando..." : "Descargar catálogo"}
    </Button>
  )
}
