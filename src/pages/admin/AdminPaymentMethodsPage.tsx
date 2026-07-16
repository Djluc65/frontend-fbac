import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  BadgeDollarSign,
  Banknote,
  CreditCard,
  HandCoins,
  Landmark,
  MapPinned,
  QrCode,
  Save,
  ShieldAlert,
  WalletCards,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAppSelector } from '../../app/hooks'
import AdminShell from '../../components/admin/AdminShell'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { selectCurrentUser } from '../../features/auth/authSelectors'
import {
  useGetAdminPaymentMethodsQuery,
  useUpdateAdminPaymentMethodMutation,
} from '../../features/payments/paymentApi'
import type { PaymentMethodId, PaymentMethodOption } from '../../features/payments/paymentTypes'

const paymentMethodSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  description: z.string().min(5, 'La description doit contenir au moins 5 caractères.'),
  enabled: z.boolean(),
  displayOrder: z.coerce.number().min(0, "L'ordre d'affichage doit être positif."),
  iconUrl: z.string().trim().optional().or(z.literal('')),
  instructions: z.string().trim().optional().or(z.literal('')),
  paypalNote: z.string().trim().optional().or(z.literal('')),
  cardNote: z.string().trim().optional().or(z.literal('')),
  bankName: z.string().trim().optional().or(z.literal('')),
  accountHolder: z.string().trim().optional().or(z.literal('')),
  accountNumberMasked: z.string().trim().optional().or(z.literal('')),
  iban: z.string().trim().optional().or(z.literal('')),
  swift: z.string().trim().optional().or(z.literal('')),
  bankCurrency: z.string().trim().optional().or(z.literal('')),
  bankInstructions: z.string().trim().optional().or(z.literal('')),
  zelleRecipientName: z.string().trim().optional().or(z.literal('')),
  zelleEmail: z.string().trim().optional().or(z.literal('')),
  zellePhone: z.string().trim().optional().or(z.literal('')),
  zelleInstructions: z.string().trim().optional().or(z.literal('')),
  cashRecipientName: z.string().trim().optional().or(z.literal('')),
  cashtag: z.string().trim().optional().or(z.literal('')),
  qrCodeUrl: z.string().trim().optional().or(z.literal('')),
  cashInstructions: z.string().trim().optional().or(z.literal('')),
  onSiteAddress: z.string().trim().optional().or(z.literal('')),
  onSitePhone: z.string().trim().optional().or(z.literal('')),
  onSiteHours: z.string().trim().optional().or(z.literal('')),
  onSiteInstructions: z.string().trim().optional().or(z.literal('')),
})

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>

const methodIcons: Record<PaymentMethodId, typeof WalletCards> = {
  PAYPAL: WalletCards,
  CARD: CreditCard,
  BANK_TRANSFER: Landmark,
  ZELLE: BadgeDollarSign,
  CASH_APP: QrCode,
  ON_SITE: HandCoins,
}

const methodTheme: Record<PaymentMethodId, string> = {
  PAYPAL: 'from-[#0070BA] to-[#003087]',
  CARD: 'from-slate-700 to-slate-900',
  BANK_TRANSFER: 'from-orange-500 to-orange-700',
  ZELLE: 'from-violet-500 to-fuchsia-600',
  CASH_APP: 'from-emerald-500 to-green-600',
  ON_SITE: 'from-amber-500 to-orange-600',
}

const getApiErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return 'Une erreur est survenue.'
  }

  if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Impossible de traiter la demande.'
}

const hasPaymentAccess = (permissions: string[] | undefined) =>
  Boolean(
    permissions?.includes('*') ||
      permissions?.includes('donations.manage') ||
      permissions?.includes('donations.read')
  )

const normalizeText = (value?: string) => {
  const normalized = value?.trim()
  return normalized ? normalized : undefined
}

const buildDefaultValues = (method?: PaymentMethodOption | null): PaymentMethodFormValues => {
  const config = method?.publicConfiguration ?? {}

  return {
    name: method?.name ?? '',
    description: method?.description ?? '',
    enabled: method?.enabled ?? true,
    displayOrder: method?.displayOrder ?? 0,
    iconUrl: method?.iconUrl ?? '',
    instructions: method?.instructions ?? '',
    paypalNote: String(config.note ?? ''),
    cardNote: String(config.note ?? ''),
    bankName: String(config.bankName ?? ''),
    accountHolder: String(config.accountHolder ?? ''),
    accountNumberMasked: String(config.accountNumberMasked ?? ''),
    iban: String(config.iban ?? ''),
    swift: String(config.swift ?? ''),
    bankCurrency: String(config.currency ?? ''),
    bankInstructions: String(config.instructions ?? ''),
    zelleRecipientName: String(config.recipientName ?? ''),
    zelleEmail: String(config.zelleEmail ?? ''),
    zellePhone: String(config.zellePhone ?? ''),
    zelleInstructions: String(config.instructions ?? ''),
    cashRecipientName: String(config.recipientName ?? ''),
    cashtag: String(config.cashtag ?? ''),
    qrCodeUrl: String(config.qrCodeUrl ?? ''),
    cashInstructions: String(config.instructions ?? ''),
    onSiteAddress: String(config.address ?? ''),
    onSitePhone: String(config.phone ?? ''),
    onSiteHours: String(config.hours ?? ''),
    onSiteInstructions: String(config.instructions ?? ''),
  }
}

const buildPublicConfiguration = (methodId: PaymentMethodId, values: PaymentMethodFormValues) => {
  switch (methodId) {
    case 'PAYPAL':
      return {
        note: normalizeText(values.paypalNote),
      }
    case 'CARD':
      return {
        note: normalizeText(values.cardNote),
      }
    case 'BANK_TRANSFER':
      return {
        bankName: normalizeText(values.bankName),
        accountHolder: normalizeText(values.accountHolder),
        accountNumberMasked: normalizeText(values.accountNumberMasked),
        iban: normalizeText(values.iban),
        swift: normalizeText(values.swift),
        currency: normalizeText(values.bankCurrency),
        instructions: normalizeText(values.bankInstructions),
      }
    case 'ZELLE':
      return {
        recipientName: normalizeText(values.zelleRecipientName),
        zelleEmail: normalizeText(values.zelleEmail),
        zellePhone: normalizeText(values.zellePhone),
        instructions: normalizeText(values.zelleInstructions),
      }
    case 'CASH_APP':
      return {
        recipientName: normalizeText(values.cashRecipientName),
        cashtag: normalizeText(values.cashtag),
        qrCodeUrl: normalizeText(values.qrCodeUrl),
        instructions: normalizeText(values.cashInstructions),
      }
    case 'ON_SITE':
      return {
        address: normalizeText(values.onSiteAddress),
        phone: normalizeText(values.onSitePhone),
        hours: normalizeText(values.onSiteHours),
        instructions: normalizeText(values.onSiteInstructions),
      }
    default:
      return {}
  }
}

const cleanObject = (value: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== ''))

const AdminPaymentMethodsPage = () => {
  const user = useAppSelector(selectCurrentUser)
  const permissions = user?.permissions
  const canManagePayments = hasPaymentAccess(permissions)
  const [selectedMethodId, setSelectedMethodId] = useState<PaymentMethodId | null>(null)

  const { data: methods = [], isLoading, isFetching } = useGetAdminPaymentMethodsQuery(undefined, {
    skip: !canManagePayments,
  })
  const [updatePaymentMethod, { isLoading: isSaving }] = useUpdateAdminPaymentMethodMutation()

  const sortedMethods = useMemo(
    () => [...methods].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [methods]
  )

  const selectedMethod =
    sortedMethods.find((method) => method.id === selectedMethodId) ?? sortedMethods[0] ?? null

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: buildDefaultValues(selectedMethod),
  })

  useEffect(() => {
    if (!selectedMethodId && sortedMethods.length > 0) {
      setSelectedMethodId(sortedMethods[0].id)
    }
  }, [selectedMethodId, sortedMethods])

  useEffect(() => {
    reset(buildDefaultValues(selectedMethod))
  }, [reset, selectedMethod])

  const values = watch()

  const onSubmit = async (formValues: PaymentMethodFormValues) => {
    if (!selectedMethod) {
      return
    }

    try {
      await updatePaymentMethod({
        id: selectedMethod.id,
        name: formValues.name,
        description: formValues.description,
        enabled: formValues.enabled,
        displayOrder: formValues.displayOrder,
        iconUrl: normalizeText(formValues.iconUrl),
        instructions: normalizeText(formValues.instructions),
        publicConfiguration: cleanObject(buildPublicConfiguration(selectedMethod.id, formValues)),
      }).unwrap()

      toast.success(`La méthode ${selectedMethod.name} a été mise à jour.`)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  const enabledCount = sortedMethods.filter((method) => method.enabled).length

  if (!canManagePayments) {
    return (
      <AdminShell
        title="Gestion des paiements"
        description="Activez, désactivez et configurez les moyens de paiement visibles côté donateur."
      >
        <div className="rounded-3xl bg-white p-8 shadow-panel">
          <p className="text-sm leading-6 text-slate-600">
            Votre compte ne dispose pas des permissions nécessaires pour gérer les moyens de paiement.
          </p>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Gestion des paiements"
      description="Configurez les moyens de paiement affichés au public, sans jamais stocker de secrets ni de clés privées."
      actions={
        <div className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white">
          {enabledCount} moyen{enabledCount > 1 ? 's' : ''} actif{enabledCount > 1 ? 's' : ''}
        </div>
      }
    >
      <div className="space-y-6">
        <section className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-panel">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-600" aria-hidden="true" />
            <div className="space-y-2 text-sm text-amber-900">
              <p className="font-semibold">Rappel sécurité</p>
              <p>
                Cette page ne doit contenir que des informations publiques destinées aux donateurs:
                intitulés, instructions, coordonnées masquées, CashTag, e-mail Zelle, horaires ou QR code public.
              </p>
              <p>
                N&apos;y stockez jamais de mot de passe, clé API, secret PayPal, numéro de carte complet ou donnée bancaire sensible.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <section className="rounded-3xl bg-white p-6 shadow-panel">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-slate-900">Moyens de paiement</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sélectionnez une méthode pour modifier son affichage public.
                </p>
              </div>
              {(isLoading || isFetching) ? (
                <span className="text-sm font-medium text-slate-500">Chargement...</span>
              ) : null}
            </div>

            <div className="space-y-3">
              {sortedMethods.map((method) => {
                const Icon = methodIcons[method.id]
                const isSelected = selectedMethod?.id === method.id

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethodId(method.id)}
                    className={`w-full rounded-3xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-orange-300 bg-orange-50 shadow-sm'
                        : 'border-slate-200 hover:border-orange-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${methodTheme[method.id]} text-white`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{method.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{method.description}</p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          method.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {method.enabled ? 'Actif' : 'Désactivé'}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>Code: {method.code}</span>
                      <span>Ordre: {method.displayOrder ?? 0}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="space-y-6">
            <article className="rounded-3xl bg-white p-6 shadow-panel">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-slate-900">
                    {selectedMethod ? `Configurer ${selectedMethod.name}` : 'Configuration'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Ajustez ici le libellé, la visibilité, les instructions et les données publiques.
                  </p>
                </div>
              </div>

              {selectedMethod ? (
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      id="payment-name"
                      label="Nom affiché"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <Input
                      id="payment-order"
                      type="number"
                      min="0"
                      label="Ordre d'affichage"
                      error={errors.displayOrder?.message}
                      {...register('displayOrder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="payment-description" className="block text-sm font-medium text-slate-700">
                      Description
                    </label>
                    <textarea
                      id="payment-description"
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                      placeholder="Description affichée sur le parcours de don."
                      {...register('description')}
                    />
                    {errors.description ? (
                      <p className="text-sm text-red-600">{errors.description.message}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      id="payment-icon-url"
                      type="url"
                      label="URL de l'icône (optionnel)"
                      placeholder="https://..."
                      error={errors.iconUrl?.message}
                      {...register('iconUrl')}
                    />
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                        {...register('enabled')}
                      />
                      Méthode visible et activée côté utilisateur
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="payment-instructions" className="block text-sm font-medium text-slate-700">
                      Instructions générales
                    </label>
                    <textarea
                      id="payment-instructions"
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                      placeholder="Texte explicatif visible côté utilisateur."
                      {...register('instructions')}
                    />
                  </div>

                  {selectedMethod.id === 'PAYPAL' ? (
                    <div className="rounded-3xl border border-slate-200 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <WalletCards className="h-5 w-5 text-orange-500" />
                        <h3 className="font-display text-xl font-semibold text-slate-900">Configuration publique PayPal</h3>
                      </div>
                      <Input
                        id="paypal-note"
                        label="Note publique"
                        placeholder="Paiement sécurisé avec redirection PayPal."
                        {...register('paypalNote')}
                      />
                    </div>
                  ) : null}

                  {selectedMethod.id === 'CARD' ? (
                    <div className="rounded-3xl border border-slate-200 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-orange-500" />
                        <h3 className="font-display text-xl font-semibold text-slate-900">Configuration publique carte</h3>
                      </div>
                      <Input
                        id="card-note"
                        label="Note publique"
                        placeholder="Bientôt disponible."
                        {...register('cardNote')}
                      />
                    </div>
                  ) : null}

                  {selectedMethod.id === 'BANK_TRANSFER' ? (
                    <div className="rounded-3xl border border-slate-200 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <Landmark className="h-5 w-5 text-orange-500" />
                        <h3 className="font-display text-xl font-semibold text-slate-900">Configuration publique du virement</h3>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input id="bank-name" label="Nom de la banque" {...register('bankName')} />
                        <Input id="account-holder" label="Titulaire du compte" {...register('accountHolder')} />
                        <Input
                          id="account-number-masked"
                          label="Numéro de compte masqué"
                          placeholder="****1234"
                          {...register('accountNumberMasked')}
                        />
                        <Input id="iban" label="IBAN" {...register('iban')} />
                        <Input id="swift" label="SWIFT" {...register('swift')} />
                        <Input id="bank-currency" label="Devise" placeholder="USD" {...register('bankCurrency')} />
                      </div>
                      <div className="mt-4 space-y-2">
                        <label htmlFor="bank-instructions" className="block text-sm font-medium text-slate-700">
                          Instructions publiques du virement
                        </label>
                        <textarea
                          id="bank-instructions"
                          rows={4}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                          {...register('bankInstructions')}
                        />
                      </div>
                    </div>
                  ) : null}

                  {selectedMethod.id === 'ZELLE' ? (
                    <div className="rounded-3xl border border-slate-200 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <Banknote className="h-5 w-5 text-orange-500" />
                        <h3 className="font-display text-xl font-semibold text-slate-900">Configuration publique Zelle</h3>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input id="zelle-recipient-name" label="Nom du bénéficiaire" {...register('zelleRecipientName')} />
                        <Input id="zelle-email" type="email" label="E-mail Zelle" {...register('zelleEmail')} />
                        <Input id="zelle-phone" label="Téléphone Zelle" {...register('zellePhone')} />
                      </div>
                      <div className="mt-4 space-y-2">
                        <label htmlFor="zelle-instructions" className="block text-sm font-medium text-slate-700">
                          Instructions publiques Zelle
                        </label>
                        <textarea
                          id="zelle-instructions"
                          rows={4}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                          {...register('zelleInstructions')}
                        />
                      </div>
                    </div>
                  ) : null}

                  {selectedMethod.id === 'CASH_APP' ? (
                    <div className="rounded-3xl border border-slate-200 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <QrCode className="h-5 w-5 text-orange-500" />
                        <h3 className="font-display text-xl font-semibold text-slate-900">Configuration publique Cash App</h3>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input id="cash-recipient-name" label="Nom du bénéficiaire" {...register('cashRecipientName')} />
                        <Input id="cash-cashtag" label="CashTag" placeholder="$FondationCassis" {...register('cashtag')} />
                        <Input id="cash-qr-url" type="url" label="URL du QR Code" placeholder="https://..." {...register('qrCodeUrl')} />
                      </div>
                      <div className="mt-4 space-y-2">
                        <label htmlFor="cash-instructions" className="block text-sm font-medium text-slate-700">
                          Instructions publiques Cash App
                        </label>
                        <textarea
                          id="cash-instructions"
                          rows={4}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                          {...register('cashInstructions')}
                        />
                      </div>
                    </div>
                  ) : null}

                  {selectedMethod.id === 'ON_SITE' ? (
                    <div className="rounded-3xl border border-slate-200 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <MapPinned className="h-5 w-5 text-orange-500" />
                        <h3 className="font-display text-xl font-semibold text-slate-900">Configuration publique sur place</h3>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input id="on-site-phone" label="Téléphone" {...register('onSitePhone')} />
                        <Input id="on-site-hours" label="Horaires" placeholder="Lun-Ven 9h-16h" {...register('onSiteHours')} />
                      </div>
                      <div className="mt-4 space-y-2">
                        <label htmlFor="on-site-address" className="block text-sm font-medium text-slate-700">
                          Adresse publique
                        </label>
                        <textarea
                          id="on-site-address"
                          rows={3}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                          {...register('onSiteAddress')}
                        />
                      </div>
                      <div className="mt-4 space-y-2">
                        <label htmlFor="on-site-instructions" className="block text-sm font-medium text-slate-700">
                          Instructions publiques sur place
                        </label>
                        <textarea
                          id="on-site-instructions"
                          rows={4}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                          {...register('onSiteInstructions')}
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                    <Button variant="secondary" onClick={() => reset(buildDefaultValues(selectedMethod))}>
                      Réinitialiser
                    </Button>
                    <Button type="submit" isLoading={isSaving} disabled={!isDirty}>
                      <Save className="h-4 w-4" />
                      Enregistrer
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-slate-500">Aucune méthode de paiement disponible pour le moment.</p>
              )}
            </article>

            {selectedMethod ? (
              <article className="rounded-3xl bg-white p-6 shadow-panel">
                <h2 className="font-display text-2xl font-semibold text-slate-900">Aperçu public</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Voici les informations publiques qui seront visibles côté utilisateur.
                </p>

                <div className="mt-5 rounded-3xl border border-orange-100 bg-orange-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-xl font-semibold text-slate-900">{values.name || selectedMethod.name}</p>
                      <p className="mt-2 text-sm text-slate-600">
                        {values.description || selectedMethod.description}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        values.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {values.enabled ? 'Activé' : 'Désactivé'}
                    </span>
                  </div>

                  {(values.instructions || selectedMethod.instructions) ? (
                    <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-slate-600">
                      {values.instructions || selectedMethod.instructions}
                    </div>
                  ) : null}

                  <div className="mt-4 rounded-2xl bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">Configuration publique</p>
                    <div className="mt-3 grid gap-2 text-sm text-slate-600">
                      {Object.entries(cleanObject(buildPublicConfiguration(selectedMethod.id, values))).length > 0 ? (
                        Object.entries(cleanObject(buildPublicConfiguration(selectedMethod.id, values))).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex flex-col gap-1 rounded-xl border border-slate-100 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <span className="font-medium text-slate-900">{key}</span>
                              <span className="break-all">{String(value)}</span>
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-slate-500">Aucune donnée publique spécifique renseignée.</p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ) : null}
          </section>
        </div>
      </div>
    </AdminShell>
  )
}

export default AdminPaymentMethodsPage
