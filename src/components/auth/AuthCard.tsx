import type { ReactNode } from 'react'
import { ShieldCheck } from 'lucide-react'
import BrandLogo from '../common/BrandLogo'

interface AuthCardProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

const AuthCard = ({ title, description, children, footer }: AuthCardProps) => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-10 sm:px-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-panel lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden bg-gradient-to-br from-orange-600 to-orange-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <BrandLogo
            to="/"
            className="inline-flex max-w-full"
            imageClassName="max-w-[220px]"
            variant="light"
          />

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-orange-100">
                Administration securisee
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight">
                Gere la fondation depuis une interface claire et moderne.
              </h1>
            </div>
            <p className="max-w-xl text-base leading-7 text-orange-50">
              Cette interface est reservee aux administrateurs autorises.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 text-sm text-orange-50">
            Vos actions sensibles sont protegees par des liens temporaires et des sessions securisees.
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="mx-auto flex w-full max-w-md flex-col">
            <div className="mb-8 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700 lg:hidden">
                <ShieldCheck className="h-4 w-4" />
                Espace administration
              </div>
              <BrandLogo
                to="/"
                className="inline-flex max-w-full lg:hidden"
                imageClassName="max-w-[180px] sm:max-w-[220px]"
              />
              <h2 className="font-display text-3xl font-bold text-slate-900">{title}</h2>
              <p className="text-sm leading-6 text-slate-500">{description}</p>
            </div>

            <div className="min-w-0">{children}</div>

            {footer ? <div className="mt-6">{footer}</div> : null}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AuthCard
