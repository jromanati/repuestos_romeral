"use client"

import useSWR from "swr"
import { ProductService } from "@/services/product.service"

export type CatalogData = {
  products: any[]
  categories: any[]
}

const fetchCatalog = async (): Promise<CatalogData> => {
  const isAuthenticated = await ProductService.ensureAuthenticated()
  if (!isAuthenticated) return { products: [], categories: [] }

  const resp = await ProductService.getProducts()
  const rawProducts = (resp as any)?.data?.products ?? []
  const rawCategories = (resp as any)?.data?.categories ?? []
  return { products: rawProducts, categories: rawCategories }
}

export function useCatalog() {
  return useSWR<CatalogData>("catalog", fetchCatalog, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })
}
