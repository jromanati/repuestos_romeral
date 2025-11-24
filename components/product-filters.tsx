"use client"
import { useState, useCallback, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ShoppingCart, Search, Grid3X3, List, Star, Eye, SlidersHorizontal, ChevronDown, ChevronRight } from "lucide-react"

interface Filters {
  selectedCategories: string[]
  selectedBrands: string[]  
  model: string
  priceRange: [number, number]
  in_stock: boolean
  sortBy: string
}

interface Category {
  id: string
  name: string
  parent: string | null
  products_count: number
  subcategories?: Category[]
}

interface Brand {
  id: string
  name: string
  products_count: number
}

interface ProductFiltersProps {
  filters: Filters
  categories: Category[]
  brands: Brand[]
  onFiltersChange: (filters: Filters) => void
}

// const categories = [
//   { value: "all", label: "Todas las categorías" },
//   { value: "frenos", label: "Frenos" },
//   { value: "suspension", label: "Suspensión" },
//   { value: "audio", label: "Audio" },
//   { value: "llantas", label: "Llantas" },
//   { value: "motor", label: "Motor" },
// ]

// const brands = [
//   { value: "all", label: "Todas las marcas" },
//   { value: "Philips", label: "Philips" },
//   { value: "Brembo", label: "Brembo" },
//   { value: "Pioneer", label: "Pioneer" },
//   { value: "Monroe", label: "Monroe" },
//   { value: "OZ Racing", label: "OZ Racing" },
//   { value: "K&N", label: "K&N" },
// ]

const sortOptions = [
  { value: "name", label: "Nombre A-Z" },
  { value: "price-low", label: "Precio: Menor a Mayor" },
  { value: "price-high", label: "Precio: Mayor a Menor" },
  { value: "rating", label: "Mejor Valorados" },
]

export default function ProductFilters({ filters, categories, brands, onFiltersChange }: ProductFiltersProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    localStorage.setItem("search_product", "")
    const searchInput = document.getElementById("search") as HTMLInputElement | null
    if (searchInput) searchInput.value = ""
    setSelectedCategories([])
    setSelectedBrands([])
    onFiltersChange({
      selectedCategories: [],
      selectedBrands: [],
      model: "",
      priceRange: [0, 500000],
      in_stock: false,
      sortBy: "name",
    })
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // Si se deselecciona una categoría principal, también deseleccionar sus subcategorías
        const category = categories.find((cat) => cat.id === categoryId)
        if (category && category.subcategories) {
          const subcategoryIds = category.subcategories.map((sub) => sub.id)
          return prev.filter((id) => id !== categoryId && !subcategoryIds.includes(id))
        }
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  useEffect(() => {
      onFiltersChange({
        ...filters,
        selectedCategories: selectedCategories,
      })
  }, [selectedCategories])

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const isCategorySelected = (categoryId: string) => {
    return selectedCategories.includes(categoryId)
  }

  const isSubcategorySelected = (subcategoryId: string) => {
    return selectedCategories.includes(subcategoryId)
  }

  const getSelectedCategoriesCount = () => {
    return selectedCategories.length
  }

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brandId)) {
        return prev.filter((id) => id !== brandId)
      } else {
        return [...prev, brandId]
      }
    })
  }
  const isBrandSelected = (brandId: string) => {
    return selectedBrands.includes(brandId)
  }
  useEffect(() => {
      onFiltersChange({
        ...filters,
        selectedBrands: selectedBrands,
      })
  }, [selectedBrands])

  return (
    <div className="space-y-6">
      {/* Ordenar por */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ordenar por</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categoría */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {categories.filter((category) => category.parent === null).map((category) => (
              <div key={category.id} className="space-y-1">
                <div className="flex items-center space-x-2 py-1">
                  {category.subcategories &&
                    category.subcategories.length < 1 && 
                      <Checkbox
                        id={category.id}
                        checked={isCategorySelected(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                        className="border-red-600 data-[state=checked]:bg-red-600"
                      />
                  }
                  <button
                    onClick={() => toggleCategoryExpansion(category.id)}
                    className="flex items-center space-x-1 flex-1 text-left hover:text-red-400 transition-colors"
                  >
                    {category.subcategories &&
                      category.subcategories.length > 0 &&
                      (expandedCategories.includes(category.id) ? (
                        <ChevronDown className="w-3 h-3 text-black-500" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-black-500" />
                      ))}
                    <label
                      htmlFor={`category-value-${category.id}`}
                      className="text-sm text-black cursor-pointer flex-1 flex justify-between font-medium"
                    >
                      <span>{category.name}</span>
                      <span className="text-black">({category.products_count})</span>
                    </label>
                  </button>
                </div>

                {/* Subcategorías */}
                {category.subcategories && expandedCategories.includes(category.id) && (
                  <div className="ml-6 space-y-1 border-l border-black/30 pl-3">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={subcategory.id}
                          checked={isSubcategorySelected(subcategory.id)}
                          onCheckedChange={() => toggleCategory(subcategory.id)}
                          className="border-black data-[state=checked]:bg-black"
                        />
                        <label
                          htmlFor={`subcategory-value-${subcategory.id}`}
                          className="text-sm text-black-400 cursor-pointer flex-1 flex justify-between hover:text-black-300 transition-colors"
                        >
                          <span>{subcategory.name}</span>
                          <span className="text-black-400">({subcategory.products_count})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marca  */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Marcas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={brand.id}
                  checked={isBrandSelected(brand.id)}
                  onCheckedChange={() => toggleBrand(brand.id)}
                  className="border-black data-[state=checked]:bg-black"
                />
                <label
                  htmlFor={`brand-value-${brand.id}`}
                  className="text-sm text-black cursor-pointer flex-1 flex justify-between hover:text-black transition-colors"
                >
                  <span>{brand.name}</span>
                  <span className="text-black">({brand.products_count})</span>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modelo del vehículo 
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Modelo del Vehículo</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Ej: Toyota Corolla"
            value={filters.model}
            onChange={(e) => handleFilterChange("model", e.target.value)}
          />
        </CardContent>
      </Card>*/}

      {/* Rango de precio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Precio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => {
              if (Array.isArray(value) && value.length === 2) {
                handleFilterChange("priceRange", value as [number, number])
              }
            }}
            max={500000}
            min={0}
            step={10000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </CardContent>
      </Card>

      {/* Disponibilidad */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Disponibilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in_stock"
              checked={filters.in_stock}
              onCheckedChange={(checked) => handleFilterChange("in_stock", checked)}
            />
            <Label htmlFor="in_stock">Solo productos en stock</Label>
          </div>
        </CardContent>
      </Card>

      {/* Limpiar filtros */}
      <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
        Limpiar Filtros
      </Button>
    </div>
  )
}
