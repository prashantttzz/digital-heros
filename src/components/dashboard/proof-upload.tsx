'use client'

import { useState } from 'react'
import { Upload, CheckCircle2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { uploadWinnerProof } from '@/app/actions/verification'
import { toast } from 'sonner'

export function ProofUpload({ winnerId, onUploadComplete }: { winnerId: string, onUploadComplete: () => void }) {
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${winnerId}-${Math.random()}.${fileExt}`
      const filePath = `winner-proofs/${fileName}`

      // 1. Upload to Supabase Storage
      const { data, error: storageError } = await supabase.storage
        .from('proofs')
        .upload(filePath, file)

      if (storageError) throw storageError

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('proofs')
        .getPublicUrl(filePath)

      // 3. Update Database via Server Action
      await uploadWinnerProof(winnerId, publicUrl)
      
      toast.success('Proof uploaded successfully!')
      onUploadComplete()
    } catch (error: unknown) {
      console.error('Upload error:', error)
      const message = error instanceof Error ? error.message : 'Failed to upload proof'
      toast.error(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative group">
      <input
        type="file"
        id={`proof-${winnerId}`}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <label
        htmlFor={`proof-${winnerId}`}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-md cursor-pointer group-hover:scale-105"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload Score Proof
          </>
        )}
      </label>
    </div>
  )
}
