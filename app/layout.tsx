import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import { CartProvider } from "@/contexts/cart-context"
import { WebSocketProvider } from "@/components/providers/websocket-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Repuestos Romeral",
  description: "Tu tienda de confianza para repuestos y accesorios automotrices. Envío a todo Chile.",
    generator: 'metras'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
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
