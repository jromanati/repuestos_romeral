"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, MessageCircle, Star, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/products"

const staticSlides = [
  {
    id: 1,
    title: "Herramientas y Equipamiento Automotriz",
    subtitle: "Todo lo que necesitas para trabajar con precisión y confianza",
    description:
      "Encuentra una amplia variedad de herramientas manuales, llaves, alicates, dados, kits profesionales y accesorios diseñados para talleres mecánicos y uso profesional.",
    image: "/images/image2.jpeg?height=1600&width=800",
    cta: "Ver Herramientas",
    link: "/catalog",
    accent: "from-yellow-600 to-orange-700",
  },
  {
    id: 2,
    title: "Lubricantes, Aceites y Productos de Mantención",
    subtitle: "Protección y rendimiento para cada motor",
    description:
      "Descubre nuestra línea completa de aceites, lubricantes, limpia frenos, siliconas, aditivos y productos especializados para el cuidado y mantención automotriz.",
    image: "/images/image3.jpeg?height=500&width=800",
    cta: "Ver Lubricantes",
    link: "/catalog",
    accent: "from-blue-600 to-blue-800",
  },
  {
    id: 3,
    title: "Equipos, Refrigerantes y Productos Técnicos",
    subtitle: "Soluciones profesionales para tu taller o vehículo",
    description:
      "Compresores, gatos hidráulicos, refrigerantes, anticongelantes, DEF y productos técnicos esenciales para un servicio automotriz completo y eficiente.",
    image: "/images/image4.jpeg?height=500&width=800",
    cta: "Ver Productos",
    link: "/catalog",
    accent: "from-red-600 to-red-800",
  },
]

type HeroProps = {
  products: Product[]
}

const firstImageUrl = (images?: Product["images"]): string | undefined => {
  if (!Array.isArray(images) || images.length === 0) return undefined
  const first = images[0]
  if (!first) return undefined
  if (typeof (first as any) === "string") return first as any
  return (first as any).url
}

export default function Hero({ products }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const truncate = (text: string | undefined, max: number) => {
    if (!text) return ""
    if (text.length <= max) return text
    const shortened = text.slice(0, max)
    // Buscar el último espacio antes del límite
    const lastSpaceIndex = shortened.lastIndexOf(" ")
    if (lastSpaceIndex === -1) {
      // No hay espacios (por ejemplo una sola palabra muy larga): corta normal
      return shortened.trimEnd() + "..."
    }
    return shortened.slice(0, lastSpaceIndex).trimEnd() + "..."
  }

  const slides = useMemo(() => {
    const hasProducts = Array.isArray(products) && products.length > 0

    const productSlides = (products || [])
      .filter(p => p.is_new)
      .map(p => {
        const image = p.main_image || firstImageUrl(p.images)
        if (!image) return null

        return {
          id: p.id,
          title: p.name,
          subtitle: p.category_name,
          description: p.description || "",
          image,
          cta: "Ver producto",
          link: `/product/${p.id}`,
          accent: "from-red-600 to-red-800",
        }
      })
      .filter(Boolean) as typeof staticSlides

    const valid = productSlides.slice(0, 5)

    // Si aún no hay productos cargados o el filtro no dejó ningún producto nuevo con imagen,
    // no mostramos slides (evitamos usar solo slides estáticos)
    if (!hasProducts || valid.length === 0) return []

    if (valid.length >= 5) return valid

    const needed = 5 - valid.length
    const fallback = staticSlides.slice(0, needed).map((s, idx) => ({
      ...s,
      id: 1000 + s.id + idx,
    }))
    return [...valid, ...fallback]
  }, [products])

  useEffect(() => {
    if (!slides.length) return
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 9000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  }

  // Mientras no haya slides (por ejemplo, catálogo cargando), mostramos un loader simple
  if (!slides.length) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex flex-col items-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mb-4" />
          <p className="text-sm text-gray-300 uppercase tracking-[0.25em]">Cargando productos destacados...</p>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Hero principal con diseño innovador */}
      <section className="relative min-h-[70vh] lg:min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Formas geométricas de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Slider de productos */}
        <div className="relative h-[70vh] lg:h-screen">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              {/* Fondo de imagen para mobile */}
              {slide.image && (
                <div className="absolute inset-0 lg:hidden">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover opacity-40"
                    priority={index === 0}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/60 to-transparent`} />
                </div>
              )}

              <div className="container mx-auto px-4 h-full flex items-start lg:items-center pt-16 lg:pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center w-full">
                  {/* Contenido de texto */}
                  <div className="text-white space-y-6 z-10">
                    <div className="space-y-2">
                      <div
                        className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${slide.accent} text-sm font-medium`}
                      >
                        {slide.subtitle}
                      </div>
                      <h1 className="text-3xl md:text-6xl font-bold leading-tight">{slide.title}</h1>
                      {/* Descripción truncada en mobile y desktop */}
                      <p className="text-base md:text-xl text-gray-300 leading-relaxed max-w-lg">
                        {truncate(slide.description, 290)}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href={slide.link}>
                        <Button
                          size="lg"
                          className={`bg-gradient-to-r ${slide.accent} hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-8 py-4 text-lg`}
                        >
                          {slide.cta || "Más Información"}
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Imagen del producto (solo visible en pantallas grandes) */}
                  <div className="relative hidden lg:block">
                    <div className="relative w-full h-full lg:h-[800px] rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-800">
                      <Image
                        src={slide.image || "/placeholder.svg"}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${slide.accent} opacity-20`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controles del slider (solo desktop) */}
        <div className="hidden md:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-red-600 scale-125" : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            />
          ))}
        </div>

        {/* Botones de navegación (solo desktop) */}
        <button
          onClick={prevSlide}
          className="hidden md:flex absolute left-8 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="hidden md:flex absolute right-8 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Sección de descripción de la empresa con diseño moderno */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-red-50 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full -translate-y-48 translate-x-48 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full translate-y-48 -translate-x-48 opacity-50"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Título principal */}
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Tu tienda de repuestos
                <span className="block text-red-600">confiable en el Maule</span>
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
            </div>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
              <div className="space-y-8">
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p className="text-xl">
                    En <span className="font-bold text-red-600">Repuestos Romeral</span>, nos especializamos en la venta
                    de repuestos automotrices para vehículos livianos, ofreciendo soluciones confiables, rápidas y al
                    mejor precio.
                  </p>

                  <p>
                    Contamos con un amplio stock de productos como{" "}
                    <span className="font-semibold text-gray-900">
                      kits de embrague, pistones, anillos, filtros, bujías, pernos, sensores
                    </span>{" "}
                    y mucho más, enfocados en marcas nacionales e internacionales de calidad comprobada.
                  </p>

                  <p>
                    Ubicados en el corazón de Romeral, somos un negocio local con atención personalizada, asesoría
                    técnica y compromiso con nuestros clientes.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-2xl shadow-xl">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white bg-opacity-20 p-3 rounded-full">
                      <Star className="w-8 h-8" />
                    </div>
                    <p className="text-xl font-semibold">
                      Si no tenemos el repuesto que necesitas, ¡lo buscamos por ti!
                    </p>
                  </div>
                </div>
              </div>

              {/* Características destacadas */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <Zap className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Servicio Rápido</h3>
                  </div>
                  <p className="text-gray-600">Atención inmediata y soluciones eficientes para tu vehículo.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Calidad Garantizada</h3>
                  </div>
                  <p className="text-gray-600">Productos de marcas reconocidas con garantía de calidad.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <MessageCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Asesoría Experta</h3>
                  </div>
                  <p className="text-gray-600">Consulta técnica especializada para encontrar el repuesto correcto.</p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/catalog">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Ver Catálogo Completo
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-10 py-4 text-lg rounded-full bg-transparent transition-all duration-200"
                  onClick={() =>
                    window.open(
                      "https://wa.me/56968129078?text=Hola! Me gustaría consultar sobre repuestos para mi vehículo.",
                      "_blank",
                    )
                  }
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Consultar por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
