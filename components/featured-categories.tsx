"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type Category = {
  id: string | number
  name: string
  image_url?: string | null
  parent?: string | number | null
}

type FeaturedCategoriesProps = {
  categories: Category[]
}

export default function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const categoriesWithImages = Array.from(
    new Map(
      (Array.isArray(categories) ? categories : [])
        .filter((c) => Boolean(c?.image_url) && (c?.parent === null || c?.parent === undefined))
        .map((c) => [String(c.id), c])
    ).values()
  )

  if (categoriesWithImages.length === 0) return null

  return (
    <section className="py-5 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestras Categorías</h2>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="py-2">
              {categoriesWithImages.map((category) => (
                <CarouselItem
                  key={String(category.id)}
                  className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/7"
                >
                  <Link
                    href={`/catalog?category=${encodeURIComponent(String(category.id))}`}
                    className="flex flex-col items-center text-center gap-3 group"
                  >
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full overflow-hidden border bg-white shadow-sm group-hover:shadow-md transition-shadow">
                      <Image
                        src={category.image_url as string}
                        alt={category.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="text-sm sm:text-base font-medium text-gray-900 leading-tight line-clamp-2 max-w-[10rem]">
                      {category.name}
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="hidden md:block">
              <CarouselPrevious className="bg-white/90 hover:bg-white" />
              <CarouselNext className="bg-white/90 hover:bg-white" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
