import type { ChangeEvent } from 'react'
import { ImagePlus, LoaderCircle, Upload } from 'lucide-react'
import ResilientImage from '../common/ResilientImage'

interface AdminImageUploadPanelProps {
  id: string
  title: string
  description: string
  imageUrl: string
  previewAlt: string
  isUploading: boolean
  onUpload: (file: File) => Promise<void>
}

const AdminImageUploadPanel = ({
  id,
  title,
  description,
  imageUrl,
  previewAlt,
  isUploading,
  onUpload,
}: AdminImageUploadPanelProps) => {
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file || isUploading) {
      return
    }

    await onUpload(file)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-orange-100 p-2 text-orange-600">
          <ImagePlus className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor={id}
          className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isUploading
              ? 'pointer-events-none bg-slate-200 text-slate-500'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {isUploading ? 'Téléversement...' : 'Téléverser une image'}
        </label>
        <input
          id={id}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="sr-only"
          disabled={isUploading}
          onChange={(event) => {
            void handleFileChange(event)
          }}
        />
        <p className="text-xs leading-5 text-slate-500">JPG, PNG, WEBP, GIF ou SVG, 5 Mo maximum.</p>
      </div>

      {imageUrl ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ResilientImage
            src={imageUrl}
            alt={previewAlt}
            className="h-44 w-full object-cover sm:h-52"
            fallbackClassName="h-44 w-full sm:h-52"
            fallbackLabel="Image indisponible"
          />
          <div className="border-t border-slate-200 px-4 py-3">
            <p className="truncate text-xs text-slate-500">{imageUrl}</p>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
          Aucune image sélectionnée pour le moment.
        </div>
      )}
    </div>
  )
}

export default AdminImageUploadPanel
