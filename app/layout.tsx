import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import { CartProvider } from "@/contexts/cart-context"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AutoPartes Chile - Repuestos y Accesorios Automotrices",
  description: "Tu tienda de confianza para repuestos y accesorios automotrices. Envío a todo Chile.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          
            <Header />
            {children}
            <Footer />
            <WhatsAppButton />
          
        </CartProvider>
      </body>
    </html>
  )
}
