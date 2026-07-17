import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

type AuthStatusTone = 'success' | 'error' | 'info'

interface AuthStatusMessageProps {
  tone?: AuthStatusTone
  message: string
}

const styles: Record<AuthStatusTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-orange-200 bg-orange-50 text-orange-700',
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
} satisfies Record<AuthStatusTone, typeof Info>

const AuthStatusMessage = ({ tone = 'info', message }: AuthStatusMessageProps) => {
  const Icon = icons[tone]

  return (
    <div
      className={`flex min-w-0 items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-6 ${styles[tone]}`}
      role="status"
      aria-live="polite"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="min-w-0 break-words">{message}</p>
    </div>
  )
}

export default AuthStatusMessage
