"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface Filters {
  category: string
  brand: string
  model: string
  priceRange: [number, number]
  in_stock: boolean
  sortBy: string
}

interface ProductFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

const categories = [
  { value: "all", label: "Todas las categorías" },
  { value: "frenos", label: "Frenos" },
  { value: "suspension", label: "Suspensión" },
  { value: "audio", label: "Audio" },
  { value: "llantas", label: "Llantas" },
  { value: "motor", label: "Motor" },
]

const brands = [
  { value: "all", label: "Todas las marcas" },
  { value: "Philips", label: "Philips" },
  { value: "Brembo", label: "Brembo" },
  { value: "Pioneer", label: "Pioneer" },
  { value: "Monroe", label: "Monroe" },
  { value: "OZ Racing", label: "OZ Racing" },
  { value: "K&N", label: "K&N" },
]

const sortOptions = [
  { value: "name", label: "Nombre A-Z" },
  { value: "price-low", label: "Precio: Menor a Mayor" },
  { value: "price-high", label: "Precio: Mayor a Menor" },
  { value: "rating", label: "Mejor Valorados" },
]

export default function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
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
    onFiltersChange({
      category: "all",
      brand: "all",
      model: "",
      priceRange: [0, 500000],
      in_stock: false,
      sortBy: "name",
    })
  }

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
          <CardTitle className="text-lg">Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Marca 
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Marca</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filters.brand} onValueChange={(value) => handleFilterChange("brand", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.value} value={brand.value}>
                  {brand.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>*/}

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
