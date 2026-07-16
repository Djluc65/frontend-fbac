import { FileText, ImageIcon, Upload } from 'lucide-react'
import { toast } from 'sonner'

const ALLOWED_PROOF_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp']
const MAX_PROOF_FILE_SIZE = 5 * 1024 * 1024

interface UploadProofProps {
  value?: string
  fileName?: string
  onUploaded: (payload: {
    previewUrl: string
    fileName: string
    mimeType: string
    fileSize: number
    file: File
  }) => void
  error?: string
}

const UploadProof = ({ value, fileName, onUploaded, error }: UploadProofProps) => {
  return (
    <div className="rounded-3xl border border-dashed border-orange-200 bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-soft-black">Téléverser une preuve</p>
          <p className="mt-1 text-sm text-slate-500">Formats acceptés : PDF, PNG, JPG, JPEG, WEBP. Taille max : 5 Mo.</p>
        </div>

        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600">
          <Upload className="h-4 w-4" aria-hidden="true" />
          Téléverser un fichier
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            className="sr-only"
            onChange={(event) => {
              const selectedFile = event.target.files?.[0]

              if (!selectedFile) {
                return
              }

              if (!ALLOWED_PROOF_TYPES.includes(selectedFile.type)) {
                toast.error('Formats acceptés : PDF, PNG, JPG, JPEG ou WEBP.')
                event.target.value = ''
                return
              }

              if (selectedFile.size > MAX_PROOF_FILE_SIZE) {
                toast.error('Le fichier dépasse la taille maximale autorisée de 5 Mo.')
                event.target.value = ''
                return
              }

              const previewUrl = URL.createObjectURL(selectedFile)
              onUploaded({
                previewUrl,
                fileName: selectedFile.name,
                mimeType: selectedFile.type,
                fileSize: selectedFile.size,
                file: selectedFile,
              })
              toast.success('Fichier prêt pour l’envoi sécurisé.')
              event.target.value = ''
            }}
          />
        </label>
      </div>

      {fileName ? (
        <div className="mt-4 rounded-2xl bg-orange-50 p-4">
          <div className="flex items-center gap-3">
            {value?.startsWith('blob:') && fileName.toLowerCase().endsWith('.pdf') ? (
              <FileText className="h-5 w-5 text-orange-500" aria-hidden="true" />
            ) : (
              <ImageIcon className="h-5 w-5 text-orange-500" aria-hidden="true" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-soft-black">{fileName}</p>
              <p className="text-xs text-slate-500">Fichier prêt pour validation</p>
            </div>
          </div>
          {value && !fileName.toLowerCase().endsWith('.pdf') ? (
            <img
              src={value}
              alt="Aperçu de la preuve"
              className="mt-4 max-h-56 w-full rounded-2xl object-contain"
            />
          ) : null}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  )
}

export default UploadProof
