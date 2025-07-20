"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, Menu, X, User, MapPin, Wrench, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { items } = useCart()

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  const menuItems = [
    { href: "/catalog", label: "Nuestros Productos", icon: null },
    { href: "/ubicacion", label: "Ubicación", icon: MapPin },
    { href: "/asesoria-tecnica", label: "Asesoría Técnica", icon: Wrench },
    { href: "/contacto", label: "Contacto", icon: Phone },
    { href: "/about", label: "Quiénes Somos", icon: null },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled
          ? "shadow-xl border-b-2 border-red-100 backdrop-blur-md bg-white/95"
          : "shadow-lg border-b-2 border-red-100"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Main header */}
        <div
          className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "py-3" : "py-4"}`}
        >
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo_romeral_completo.png"
              alt="Repuestos Romeral"
              width={180}
              height={60}
              className="h-16 w-auto"
            />
          </Link>

          {/* Search bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="search"
                placeholder="Buscar productos, marcas, modelos..."
                className="pl-12 pr-4 h-12 border-2 border-gray-200 focus:border-red-500 rounded-full"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-red-50 hover:text-red-600">
              <User className="w-4 h-4 mr-2" />
              Mi Cuenta
            </Button> */}

            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-red-50 hover:text-red-600 p-3 rounded-full"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 text-xs bg-red-600">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-3 rounded-full hover:bg-red-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className={`hidden lg:flex items-center justify-center space-x-1 border-t border-gray-100 transition-all duration-300 ${
            isScrolled ? "py-3" : "py-4"
          }`}
        >
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-6 py-3 rounded-full hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span className="font-medium">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 bg-white">
            <div className="flex flex-col space-y-2">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="pl-12 pr-4 h-12 border-2 border-gray-200 focus:border-red-500 rounded-full"
                />
              </div>
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
