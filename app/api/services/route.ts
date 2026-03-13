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
      .order('display_order', { ascending: true })

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

    const { name, description, status_url, api_url, logo_domain, status_type } = await request.json()
    console.log('[v0] Adding service:', { name, status_type, userId })

    if (!name || !status_url || !api_url || !status_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()
    
    // Get the next display_order
    const { data: lastService } = await supabase
      .from('services')
      .select('display_order')
      .eq('user_id', userId)
      .order('display_order', { ascending: false })
      .limit(1)

    const nextOrder = (lastService?.[0]?.display_order ?? -1) + 1

    const { data, error } = await supabase
      .from('services')
      .insert([
        {
          user_id: userId,
          name,
          description: description || null,
          status_url,
          api_url,
          logo_domain: logo_domain || null,
          status_type,
          status: 'unknown',
          display_order: nextOrder,
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

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, display_order } = await request.json()

    if (!id || display_order === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('services')
      .update({ display_order })
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('[v0] Database error updating order:', error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    console.log('[v0] Service order updated')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Update order error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
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
