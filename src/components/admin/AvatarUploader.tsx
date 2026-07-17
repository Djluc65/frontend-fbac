import { ImagePlus, Trash2 } from 'lucide-react'
import Button from '../common/Button'

interface AvatarUploaderProps {
  avatarUrl?: string | null
  isUploading?: boolean
  onUpload: (file: File) => void
  onDelete: () => void
}

const AvatarUploader = ({ avatarUrl, isUploading = false, onUpload, onDelete }: AvatarUploaderProps) => (
  <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-panel sm:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="h-24 w-24 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar administrateur" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">Aucun avatar</div>
        )}
      </div>
      <div className="flex-1 space-y-3">
        <p className="text-sm leading-6 text-slate-500">
          Téléversez une image carrée pour personnaliser le profil administrateur.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
            <ImagePlus className="h-4 w-4" />
            {isUploading ? 'Téléversement...' : 'Changer la photo'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  onUpload(file)
                }
              }}
            />
          </label>
          {avatarUrl ? (
            <Button variant="secondary" className="sm:w-auto" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  </div>
)

export default AvatarUploader
