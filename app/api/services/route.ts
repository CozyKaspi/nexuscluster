import { auth } from '@clerk/nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
    }

    return NextResponse.json({ services: data || [] })
  } catch (error) {
    console.error('Get services error:', error)
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

    if (!name || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('services')
      .insert([
        {
          user_id: userId,
          name,
          url,
          category: category || 'other',
          is_online: true,
        },
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to add service' }, { status: 500 })
    }

    return NextResponse.json({ service: data?.[0], success: true })
  } catch (error) {
    console.error('Add service error:', error)
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

    if (!id) {
      return NextResponse.json({ error: 'Missing service ID' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete service error:', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}
