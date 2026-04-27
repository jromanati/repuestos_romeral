"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type CatalogPdfDownloadButtonProps = {
  className?: string
  showText?: boolean
  mode?: "desktop" | "menu"
  onStart?: () => void
}

export default function CatalogPdfDownloadButton({
  className,
  showText = true,
  mode = "desktop",
  onStart,
}: CatalogPdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    onStart?.()
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

  const buttonVariant = mode === "menu" ? "ghost" : "outline"
  const buttonSize = mode === "menu" ? "default" : "sm"
  const baseClassName =
    mode === "menu"
      ? "w-full justify-start space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600"
      : "hover:bg-red-50 hover:text-red-600"

  return (
    <Button
      variant={buttonVariant as any}
      size={buttonSize as any}
      className={["flex", baseClassName, className].filter(Boolean).join(" ")}
      onClick={handleDownload}
      disabled={isLoading}
      aria-label="Descargar catálogo PDF"
    >
      <Download className="w-4 h-4" />
      {showText ? <span>{isLoading ? "Descargando..." : "Descargar catálogo"}</span> : null}
    </Button>
  )
}
