import { auth } from '@clerk/nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Database error fetching services:', error)
      return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
    }

    console.log('[v0] Fetched services for user:', userId, 'count:', data?.length)
    return NextResponse.json({ services: data || [] })
  } catch (error) {
    console.error('[v0] Get services error:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, url, category } = await request.json()
    console.log('[v0] Adding service:', { name, url, category, userId })

    if (!name || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('services')
      .insert([
        {
          user_id: userId,
          name,
          url,
          category: category || 'other',
          status: 'unknown',
        },
      ])
      .select()

    if (error) {
      console.error('[v0] Database error adding service:', error)
      return NextResponse.json({ error: 'Failed to add service' }, { status: 500 })
    }

    console.log('[v0] Service added successfully:', data?.[0])
    return NextResponse.json({ service: data?.[0], success: true })
  } catch (error) {
    console.error('[v0] Add service error:', error)
    return NextResponse.json({ error: 'Failed to add service' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await request.json()
    console.log('[v0] Deleting service:', { id, userId })

    if (!id) {
      return NextResponse.json({ error: 'Missing service ID' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('[v0] Database error deleting service:', error)
      return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
    }

    console.log('[v0] Service deleted successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Delete service error:', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}
