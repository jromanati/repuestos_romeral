export interface ProductImage {
  id?: number
  url: string
  public_id?: string
  created_at?: string
}

export interface FeatureDetail {
  id: number
  name: string
  feature: number
  feature_name: string
  created_at?: string
  updated_at?: string
}

export interface ProductFeatureGroup {
  feature: {
    id: number
    name: string
    detail: FeatureDetail[]
  }
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  original_price: string
  rating: number
  stock: number
  sku: string
  category: number
  category_path: string
  is_new: boolean
  main_image?: string | null
  is_active: boolean
  created_at?: string
  updated_at?: string
  reviews: number
  images?: ProductImage[]
  features: ProductFeatureGroup[]
  deleted_images?: []
  image: string
  category_name: string
}

export interface ProductResponse {
  id: number
  name: string
  description?: string
  price: number
  original_price: string
  rating: number
  stock: number
  sku: string
  category: number
  is_new: boolean
  main_image?: string | null
  is_active: boolean
  created_at?: string
  updated_at?: string
  reviews: number
  deleted_images?: []
  image: string
  data: {
    products: [],
    categories: [],
    brands: [],

  }
  products: [],
  categories: [],
  brands: [],
  category_name: string
  category_path: string
  in_stock: boolean
  images?: ProductImage[]
  features: ProductFeatureGroup[]
  related: Product[]
  brand_data: {
    id: number
    name: string
  }
  benefits: {
    id: number
    name: string
    benefit_type: string
  }
  compatibilities: {
    id: number
    value: string
  }
  specifications: {
    id: number
    name: string
    value: string
  }
}
