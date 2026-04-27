import { NextResponse } from "next/server"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { renderToBuffer } from "@react-pdf/renderer"
import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer"

export const runtime = "nodejs"

type CatalogProduct = {
  id: number | string
  name?: string
  price?: number | string
  sku?: string
  image?: string
  main_image?: string | null
  images?: Array<{ url: string } | string>
  brand_data?: { name?: string }
}

const formatPrice = (price: unknown) => {
  const numeric = typeof price === "number" ? price : Number(price)
  if (!Number.isFinite(numeric)) return ""
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(numeric)
}

const firstImageUrl = (images?: CatalogProduct["images"]): string | undefined => {
  if (!Array.isArray(images) || images.length === 0) return undefined
  const first = images[0]
  return typeof first === "string" ? first : first?.url
}

const getApiBaseUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL || "https://api.autopartes.cl/v1"
  return base.replace(/\/+$/, "")
}

const fetchCatalog = async (authHeader: string | null) => {
  const apiBaseUrl = getApiBaseUrl()
  const headers: HeadersInit = {
    Accept: "application/json",
  }
  if (authHeader) headers.Authorization = authHeader

  const resp = await fetch(`${apiBaseUrl}/catalog`, {
    method: "GET",
    headers,
    cache: "no-store",
  })

  if (!resp.ok) {
    const text = await resp.text().catch(() => "")
    throw new Error(text || `HTTP ${resp.status}`)
  }

  const data = await resp.json()

  const products =
    (Array.isArray(data?.products) && data.products) ||
    (Array.isArray(data?.data?.products) && data.data.products) ||
    []

  return products as CatalogProduct[]
}

const buildDataUrl = (contentType: string, buf: Buffer) => {
  return `data:${contentType};base64,${buf.toString("base64")}`
}

const loadLogoDataUrl = async () => {
  const logoPath = path.join(process.cwd(), "public", "images", "logo_romeral_completo.png")
  const buf = await readFile(logoPath)
  return buildDataUrl("image/png", buf)
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 28,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
  },
  logo: {
    width: 190,
    height: 50,
    objectFit: "contain",
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 2,
  },
  subtle: {
    color: "#374151",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 12,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  metaLeft: {
    fontSize: 10,
    color: "#374151",
  },
  metaRight: {
    fontSize: 10,
    color: "#374151",
  },
  table: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  th: {
    fontSize: 9,
    fontWeight: 700,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    alignItems: "center",
  },
  rowAlt: {
    backgroundColor: "#FCFCFD",
  },
  cellImage: {
    width: 44,
    height: 44,
    borderRadius: 6,
    objectFit: "cover",
    backgroundColor: "#E5E7EB",
  },
  cellName: {
    fontSize: 9.5,
    fontWeight: 700,
    color: "#111827",
  },
  cellSub: {
    fontSize: 8.5,
    color: "#6B7280",
    marginTop: 2,
  },
  cellPrice: {
    fontSize: 10,
    fontWeight: 700,
    color: "#DC2626",
  },
  footer: {
    marginTop: 18,
    fontSize: 9,
    color: "#6B7280",
    textAlign: "center",
  },
})

function CatalogPdf({
  products,
  logoDataUrl,
  generatedAt,
}: {
  products: CatalogProduct[]
  logoDataUrl: string
  generatedAt: string
}) {
  const h = React.createElement

  const tableRows = products.map((p, idx) => {
    const img =
      (p?.main_image && String(p.main_image)) ||
      (p?.image && String(p.image)) ||
      firstImageUrl(p.images) ||
      ""

    const name = String(p?.name || "Producto")
    const brand = p?.brand_data?.name ? String(p.brand_data.name) : ""
    const sku = p?.sku ? String(p.sku) : ""
    const price = formatPrice(p?.price)

    const rowStyle = idx % 2 === 1 ? [styles.row, styles.rowAlt] : styles.row

    return h(
      View,
      { key: String(p.id), style: rowStyle, wrap: false },
      img ? h(Image, { style: styles.cellImage, src: img }) : h(View, { style: styles.cellImage }),
      h(
        View,
        { style: { flex: 1, paddingLeft: 10, paddingRight: 10 } },
        h(Text, { style: styles.cellName }, name),
        brand || sku ? h(Text, { style: styles.cellSub }, [brand, sku].filter(Boolean).join(" • ")) : null,
      ),
      h(View, { style: { width: 90, alignItems: "flex-end" } }, h(Text, { style: styles.cellPrice }, price || "-")),
    )
  })

  return h(
    Document,
    null,
    h(
      Page,
      { size: "A4", style: styles.page, wrap: true },
      h(
        View,
        { style: styles.header },
        h(Image, { style: styles.logo, src: logoDataUrl }),
        h(
          View,
          { style: styles.headerRight },
          h(Text, { style: styles.headerTitle }, "Catálogo de Productos"),
          h(Text, { style: styles.subtle }, "Tel: +56 9 6812 9078"),
          h(Text, { style: styles.subtle }, "Email: repuestosromeral.mc@gmail.com"),
          h(Text, { style: styles.subtle }, "Dirección: Av. Libertad 1024, Local 4 - Romeral"),
        ),
      ),
      h(View, { style: styles.divider }),
      h(
        View,
        { style: styles.metaRow },
        h(Text, { style: styles.metaLeft }, `Productos: ${products.length}`),
        h(Text, { style: styles.metaRight }, `Generado: ${generatedAt}`),
      ),
      h(
        View,
        { style: styles.table },
        h(
          View,
          { style: styles.tableHeader },
          h(View, { style: { width: 44 } }, h(Text, { style: styles.th }, "")),
          h(View, { style: { flex: 1, paddingLeft: 10, paddingRight: 10 } }, h(Text, { style: styles.th }, "Producto")),
          h(View, { style: { width: 90, alignItems: "flex-end" } }, h(Text, { style: styles.th }, "Precio")),
        ),
        ...tableRows,
      ),
      h(Text, { style: styles.footer }, `© ${new Date().getFullYear()} Repuestos Romeral`),
    ),
  )
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")

    const products = await fetchCatalog(authHeader)
    const logoDataUrl = await loadLogoDataUrl()

    const generatedAt = new Date().toLocaleString("es-CL", {
      timeZone: "America/Santiago",
    })

    const element = React.createElement(CatalogPdf, { products, logoDataUrl, generatedAt })
    const pdfBuffer = await renderToBuffer(element as any)

    const fileName = `catalogo-repuestos-romeral-${new Date().toISOString().slice(0, 10)}.pdf`

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
