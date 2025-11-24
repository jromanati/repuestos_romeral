"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import ProductGrid from "@/components/product-grid"
import { ProductService } from "@/services/product.service"
import ProductFilters from "@/components/product-filters"
import useSWR from 'swr'
import { useProduct, useCatalogUpdates } from "@/hooks/use-products"
import { Filter, Grid3x3, List } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CatalogPage() {
  useCatalogUpdates();
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search")?.toLowerCase() ?? ""
  const [showFilters, setShowFilters] = useState(false)
  const { getProducts } = useProduct()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  interface Filters {
    selectedCategories: string[]
    selectedBrands: string[]
    model: string
    priceRange: [number, number]
    in_stock: boolean
    sortBy: string
  }

  const [filters, setFilters] = useState<Filters>(() => {
    const categoryFromUrl = searchParams.get("category")
    return {
      selectedCategories: [],
      selectedBrands: [],
      model: "",
      priceRange: [0, 500000],
      in_stock: false,
      sortBy: "name",
    }
  })
  const PLACEHOLDER = "/placeholder.svg?height=300&width=300"

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

  const mapCategory = (c: any) => ({ ...c })
  const mapBrand = (b: any) => ({ ...b })

  const fetchProducts = async () => {
    const isAuthenticated = await ProductService.ensureAuthenticated()
    if (!isAuthenticated) return []

    const resp = await getProducts()
    const rawProducts = resp?.data.products ?? resp?.data?.products ?? []
    const rawCategories = resp?.data.categories ?? resp?.data?.categories ?? []
    const rawBrands = resp?.data.brands ?? resp?.data?.brands ?? []
    return {
      products: rawProducts.map(mapProduct),
      categories: rawCategories.map(mapCategory),
      brands: rawBrands.map(mapBrand),
    }
  }
  const { data, isLoading, error, mutate } = useSWR(
    getProducts ? "catalog" : null,
    fetchProducts,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (d) => console.log("SWR onSuccess catalog:", d),
      onError: (e) => console.error("SWR onError catalog:", e),
    }
  )
  const products = data?.products ?? []
  const categories = data?.categories ?? []
  const brands = data?.brands ?? []

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return []
    let filtered = [...products]
    let filteredCategories = []
    filteredCategories = [...categories]
    const search = localStorage.getItem("search_product")
    if (search) {
      const searchLower = search.toLowerCase()
      filteredCategories = filteredCategories.filter((category) =>
        category.name.toLowerCase().includes(searchLower)
      )
      const categoryIdsForProducts = new Set<number | string>()
      filteredCategories.forEach((category) => {
        if (category.parent === null) {
          if (category.subcategories && category.subcategories.length > 0) {
            category.subcategories.forEach((sub) => {
              categoryIdsForProducts.add(sub.id)
            })
          }
        } else {
          categoryIdsForProducts.add(category.id)
        }
      })
      if (categoryIdsForProducts.size > 0) {
        filtered = filtered.filter((product) =>
          categoryIdsForProducts.has(product.category)
        )
      }
      if (categoryIdsForProducts.size === 0) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(searchLower)
        )
      }
      console.log("Category IDs for Products:", categoryIdsForProducts)
    }

    
    if (filters.selectedCategories && filters.selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.selectedCategories.includes(product.category)
      )
    }
    if (filters.selectedBrands && filters.selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.selectedBrands.includes(product.brand)
      )
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
  }, [products, filters, searchQuery])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
            <ProductFilters filters={filters} categories={categories} brands={brands} onFiltersChange={setFilters} />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
            {isLoading ? (
              <div className="text-center py-20 text-gray-600">
                <span className="text-lg">Cargando catálogo...</span>
              </div>
            ) : (
              <ProductGrid products={paginatedProducts} viewMode={viewMode} />
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first, last, current, and adjacent pages
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        </div>
        </div>
    </div>
  )
}
