"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import ProductGrid from "@/components/product-grid"
import { ProductService } from "@/services/product.service"
import ProductFilters from "@/components/product-filters"
import useSWR from 'swr'

export default function CatalogPage() {
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  interface Filters {
    category: string
    brand: string
    model: string
    priceRange: [number, number]
    in_stock: boolean
    sortBy: string
  }

  const [filters, setFilters] = useState<Filters>(() => {
    const categoryFromUrl = searchParams.get("category")
    return {
      category: categoryFromUrl || "all",
      brand: "all",
      model: "",
      priceRange: [0, 500000],
      in_stock: false,
      sortBy: "name",
    }
  })

  // const fetchProducts = async () => {
  //   const isAuthenticated = await ProductService.ensureAuthenticated()
  //   if (!isAuthenticated) return []

  //   const productsResponse = await ProductService.getProducts()
  //   const fetchedProducts = productsResponse.data || []

  //   return fetchedProducts.map((product: any) => ({
  //     ...product,
  //     image: product.main_image ?? "/placeholder.svg?height=300&width=300",
  //   }))
  // }

  // const { data: products = [], isLoading } = useSWR('products', fetchProducts)
  
  // Simulación de carga, reemplazar con SWR o fetch real
  const isLoading = false 
  const products = [
    {
      id: 1,
      name: "Kit de Luces LED H4 6000K",
      price: 45990,
      originalPrice: 59990,
      rating: 4.8,
      reviews: 124,
      image: "/placeholder.svg?height=300&width=300",
      category: "luces",
      brand: "Philips",
      model: "Universal",
      in_stock: true,
      badge: "Oferta",
      badgeColor: "bg-red-500",
    },
    {
      id: 2,
      name: "Pastillas de Freno Brembo Premium",
      price: 89990,
      rating: 4.9,
      reviews: 89,
      image: "/placeholder.svg?height=300&width=300",
      category: "frenos",
      brand: "Brembo",
      model: "Toyota Corolla",
      in_stock: true,
      badge: "Más Vendido",
      badgeColor: "bg-green-500",
    },
    {
      id: 3,
      name: "Radio Pioneer Bluetooth USB",
      price: 129990,
      rating: 4.7,
      reviews: 156,
      image: "/placeholder.svg?height=300&width=300",
      category: "audio",
      brand: "Pioneer",
      model: "Universal",
      in_stock: true,
      badge: "Nuevo",
      badgeColor: "bg-blue-500",
    },
    {
      id: 4,
      name: "Amortiguadores Monroe Gas-Matic",
      price: 199990,
      originalPrice: 249990,
      rating: 4.6,
      reviews: 67,
      image: "/placeholder.svg?height=300&width=300",
      category: "suspension",
      brand: "Monroe",
      model: "Nissan Sentra",
      in_stock: false,
      badge: "Oferta",
      badgeColor: "bg-red-500",
    },
    {
      id: 5,
      name: 'Llantas Deportivas 17" Aleación',
      price: 320000,
      rating: 4.5,
      reviews: 43,
      image: "/placeholder.svg?height=300&width=300",
      category: "llantas",
      brand: "OZ Racing",
      model: "Universal",
      in_stock: true,
    },
    {
      id: 6,
      name: "Filtro de Aire K&N Performance",
      price: 65990,
      rating: 4.7,
      reviews: 98,
      image: "/placeholder.svg?height=300&width=300&N+air+filter=",
      category: "motor",
      brand: "K&N",
      model: "Honda Civic",
      in_stock: true,
    },
  ]

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return []
    let filtered = [...products]

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((product) => product.category === filters.category)
    }

    if (filters.brand && filters.brand !== "all") {
      filtered = filtered.filter((product) => product.brand === filters.brand)
    }

    if (filters.model) {
      filtered = filtered.filter((product) =>
        product.model?.toLowerCase().includes(filters.model.toLowerCase())
      )
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    )

    if (filters.in_stock) {
      filtered = filtered.filter((product) => product.in_stock)
    }

    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "name":
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [products, filters])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <section className="relative py-10 bg-gradient-to-r from-gray-600 to-gray-800 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 px-6 py-3 rounded-full mb-8">
              <span className="font-semibold">Nuestros Productos</span>
            </div>
            <p className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-3xl mx-auto">
              Trabajamos con un catálogo amplio y variado de repuestos para vehículoslivianos.
              Nos enfocamos en calidad, compatibilidad y disponibilidad inmediata.
            </p>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600 py-4">
          {isLoading ? "Cargando productos..." : `${filteredProducts.length} productos encontrados`}
        </p>
        <div className="flex gap-8">
          <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 flex-shrink-0`}>
            <ProductFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="text-center py-20 text-gray-600">
                <span className="text-lg">Cargando catálogo...</span>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
        </div>
    </div>
  )
}
