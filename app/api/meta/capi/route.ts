import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message: "CAPI route not implemented yet. Will be added in Day 2/3."
    },
    { status: 501 }
  )
}

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      message: "CAPI route not implemented yet. Will be added in Day 2/3."
    },
    { status: 501 }
  )
}
