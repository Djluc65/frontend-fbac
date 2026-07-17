import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightElement, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full min-w-0 max-w-full space-y-2">
        <label htmlFor={id} className="block break-words text-sm font-medium text-slate-700">
          {label}
        </label>
        <div className="relative w-full min-w-0 max-w-full">
          {leftIcon ? (
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          ) : null}
          <input
            ref={ref}
            id={id}
            className={[
              'block w-full min-w-0 max-w-full rounded-xl border bg-white px-3 py-3 text-base text-slate-900 shadow-sm transition sm:px-4 sm:text-sm',
              'overflow-x-auto',
              'placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100',
              leftIcon ? 'pl-12' : '',
              rightElement ? 'pr-12' : '',
              error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200',
              className,
            ].join(' ')}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            {...props}
          />
          {rightElement ? (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</div>
          ) : null}
        </div>
        {error ? (
          <p id={`${id}-error`} className="text-sm text-red-600">
            {error}
          </p>
        ) : hint ? (
          <p id={`${id}-hint`} className="text-sm text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
