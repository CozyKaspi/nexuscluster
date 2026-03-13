import { put } from '@vercel/blob'
import { auth } from '@clerk/nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('[v0] Uploading wallpaper for user:', userId)
    const filename = `wallpapers/${userId}-${Date.now()}.${file.name.split('.').pop()}`

    // Upload to Vercel Blob (private storage)
    const blob = await put(filename, file, {
      access: 'private',
    })

    console.log('[v0] Wallpaper uploaded to blob:', blob.pathname)

    // Save reference in Supabase using admin client
    const supabase = createAdminClient()
    
    // First check if user settings exist
    const { data: existing } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .single()

    let dbError
    if (existing) {
      // Update existing settings
      const { error } = await supabase
        .from('user_settings')
        .update({ wallpaper_url: blob.pathname })
        .eq('user_id', userId)
      dbError = error
    } else {
      // Insert new settings
      const { error } = await supabase
        .from('user_settings')
        .insert({ user_id: userId, wallpaper_url: blob.pathname })
      dbError = error
    }

    if (dbError) {
      console.error('[v0] Database error saving wallpaper:', dbError)
      return NextResponse.json({ error: 'Failed to save wallpaper' }, { status: 500 })
    }

    console.log('[v0] Wallpaper saved successfully')
    return NextResponse.json({ pathname: blob.pathname, success: true })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
