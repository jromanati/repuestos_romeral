import { NextResponse } from "next/server"

const API_URL = 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions'
const COMMERCE_CODE = '597055555532'
const API_KEY = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { buy_order, session_id, amount, return_url } = body

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Tbk-Api-Key-Id': COMMERCE_CODE,
        'Tbk-Api-Key-Secret': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        buy_order,
        session_id,
        amount,
        return_url,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      return NextResponse.json({ error }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
