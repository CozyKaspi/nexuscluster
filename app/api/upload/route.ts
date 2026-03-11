import { put } from '@vercel/blob'
import { auth } from '@clerk/nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    const filename = `${userId}-wallpaper-${Date.now()}.${file.name.split('.').pop()}`

    // Upload to Vercel Blob (private storage)
    const blob = await put(filename, file, {
      access: 'private',
    })

    // Save reference in Supabase
    const supabase = await createClient()
    const { error: dbError } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: userId,
          wallpaper_pathname: blob.pathname,
        },
        { onConflict: 'user_id' }
      )

    if (dbError) {
      return NextResponse.json({ error: 'Failed to save wallpaper' }, { status: 500 })
    }

    return NextResponse.json({ pathname: blob.pathname, success: true })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
