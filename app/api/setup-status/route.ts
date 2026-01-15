import { NextResponse } from 'next/server'
import { getSetupStatus } from '@/lib/setup-check'

export async function GET() {
  try {
    const status = await getSetupStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error('Error fetching setup status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch setup status' },
      { status: 500 }
    )
  }
}
