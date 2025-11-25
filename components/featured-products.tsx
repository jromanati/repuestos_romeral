"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductService } from "@/services/product.service"
import useSWR from 'swr'

const featuredProducts = [
  {
    id: 1,
    name: "Kit de Luces LED H4",
    price: 45990,
    originalPrice: 59990,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300",
    badge: "Oferta",
    badgeColor: "bg-red-500",
  },
  {
    id: 2,
    name: "Pastillas de Freno Brembo",
    price: 89990,
    rating: 4.9,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    badge: "Más Vendido",
    badgeColor: "bg-green-500",
  },
  {
    id: 3,
    name: "Radio Pioneer Bluetooth",
    price: 129990,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    badge: "Nuevo",
    badgeColor: "bg-blue-500",
  },
  {
    id: 4,
    name: "Amortiguadores Monroe",
    price: 199990,
    originalPrice: 249990,
    rating: 4.6,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=300",
    badge: "Oferta",
    badgeColor: "bg-red-500",
  },
]

export default function FeaturedProducts() {
  const PLACEHOLDER = "/placeholder.svg?height=300&width=300"

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }
  const firstImageUrl = (images?: any[]): string | undefined => {
    if (!Array.isArray(images) || images.length === 0) return undefined
    const first = images[0]
    return typeof first === "string" ? first : (first?.url || first?.secure_url || first?.path)
  }

  const mapProduct = (product: any) => {
    const image = product?.main_image || firstImageUrl(product?.images) || PLACEHOLDER
    return {
      ...product,
      image,
      features: product?.features ?? [],
      in_stock: product?.in_stock ?? true,
    }
  }
  const fetchProducts = async () => {
    console.log("Authentication status for featured products:")
    const isAuthenticated = await ProductService.ensureAuthenticated()
    if (!isAuthenticated) return { products: [] }

    const resp = await ProductService.getProducts()
    const rawProducts = resp?.data?.products ?? []
    console.log("Fetched products for featured:", rawProducts)

    return {
      products: rawProducts.map(mapProduct),
    }
  }

  // 👇 Aquí el arreglo: agregar KEY y pasar fetcher como segundo argumento
  const { data, error, isLoading } = useSWR(
    "featured-products",      // <- key
    fetchProducts,            // <- fetcher
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (d) => console.log("SWR onSuccess featured:", d),
      onError: (e) => console.error("SWR onError featured:", e),
    }
  )

  const products = data?.products ?? []
  const featuredProducts = products.slice(0, 3)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Los productos más populares y mejor valorados por nuestros clientes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="relative h-64 overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Badge className={`absolute top-2 left-2 ${product.badgeColor} text-white`}>{product.badge}</Badge>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/product/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Ver Detalles
                      </Button>
                    </Link>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/catalog">
            <Button size="lg" variant="outline">
              Ver Todos los Productos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
