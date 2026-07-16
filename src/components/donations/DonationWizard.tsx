import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Landmark,
  Repeat,
  Wallet,
} from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useGetCampaignsQuery } from '../../features/campaigns/campaignApi'
import type { Campaign } from '../../features/campaigns/campaignTypes'
import { selectCurrentUser } from '../../features/auth/authSelectors'
import type { CreateDonationResponse, DonationFrequency, DonationType } from '../../features/donations/donationTypes'
import {
  useCreateDonationFromPaymentWizardMutation,
  useGetPaymentMethodsQuery,
  useSubmitManualPaymentMutation,
} from '../../features/payments/paymentApi'
import { selectSelectedPaymentMethod } from '../../features/payments/paymentSelectors'
import { resetPaymentState, setSelectedPaymentMethod } from '../../features/payments/paymentSlice'
import type { PaymentMethodId, PaymentProofUploadResult } from '../../features/payments/paymentTypes'
import {
  donationWizardSchema,
  MANUAL_PAYMENT_METHODS,
  manualPaymentValidationSchema,
  type DonationWizardFormValues,
} from '../../features/payments/paymentValidation'
import { useSiteContent } from '../../features/siteContent/useSiteContent'
import DonationSummary from './DonationSummary'
import PaymentInstructions from './PaymentInstructions'
import PaymentMethodSelector from './PaymentMethodSelector'

const steps = ['Type de don', 'Montant', 'Fréquence', 'Paiement', 'Donateur', 'Confirmation du paiement'] as const

const donationTypeCards: Array<{
  value: DonationType
  title: string
  description: string
  icon: typeof HeartHandshake
}> = [
  {
    value: 'general',
    title: 'Don général',
    description: "Soutenez l'ensemble des actions de la fondation.",
    icon: HeartHandshake,
  },
  {
    value: 'program',
    title: 'Soutenir un programme',
    description: 'Attribuez votre don à un axe d’intervention précis.',
    icon: Repeat,
  },
  {
    value: 'campaign',
    title: 'Soutenir une campagne',
    description: 'Contribuez à une campagne active avec suivi de progression.',
    icon: Landmark,
  },
]

const stepFields: Record<number, Array<keyof DonationWizardFormValues>> = {
  0: ['donationType', 'campaign', 'program'],
  1: ['amount'],
  2: ['frequency'],
  3: ['paymentMethod'],
  4: ['firstName', 'lastName', 'email', 'country', 'anonymous', 'message'],
  5: ['transactionReference', 'proofImage', 'proofFileName', 'proofMimeType', 'proofFileSize'],
}

const paymentLabels: Record<PaymentMethodId, string> = {
  PAYPAL: 'PayPal',
  CARD: 'Carte bancaire',
  BANK_TRANSFER: 'Virement bancaire',
  ZELLE: 'Zelle',
  CASH_APP: 'Cash App',
  ON_SITE: 'Paiement sur place',
}

const isManualPaymentMethod = (method?: PaymentMethodId | null): method is (typeof MANUAL_PAYMENT_METHODS)[number] =>
  Boolean(method && MANUAL_PAYMENT_METHODS.includes(method as (typeof MANUAL_PAYMENT_METHODS)[number]))

const DonationWizard = () => {
  const dispatch = useAppDispatch()
  const { content } = useSiteContent()
  const [searchParams] = useSearchParams()
  const currentUser = useAppSelector(selectCurrentUser)
  const selectedPaymentMethodFromStore = useAppSelector(selectSelectedPaymentMethod)
  const isAuthenticated = Boolean(currentUser)
  const { data: campaigns = [] } = useGetCampaignsQuery()
  const { data: paymentMethods = [] } = useGetPaymentMethodsQuery()
  const [createDonation, { isLoading }] = useCreateDonationFromPaymentWizardMutation()
  const [submitManualPayment, { isLoading: isSubmittingManualPayment }] = useSubmitManualPaymentMutation()
  const [currentStep, setCurrentStep] = useState(0)
  const [customAmountEnabled, setCustomAmountEnabled] = useState(false)
  const [successDonation, setSuccessDonation] = useState<CreateDonationResponse['donation'] | null>(null)
  const [selectedProofFile, setSelectedProofFile] = useState<PaymentProofUploadResult | null>(null)
  const [submissionNotice, setSubmissionNotice] = useState<string | null>(null)
  const hasAppliedUrlPreset = useRef(false)

  const {
    register,
    watch,
    setValue,
    trigger,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DonationWizardFormValues>({
    resolver: zodResolver(donationWizardSchema),
    defaultValues: {
      donationType: 'general',
      amount: content.donatePage.presetAmounts[1] ?? 25,
      frequency: 'one_time',
      firstName: currentUser?.firstName ?? '',
      lastName: currentUser?.lastName ?? '',
      email: currentUser?.email ?? '',
      phone: '',
      country: '',
      message: '',
      anonymous: false,
      transactionReference: '',
      proofImage: '',
      proofFileName: '',
      proofMimeType: '',
      proofFileSize: 0,
      isAuthenticated,
    },
  })

  useEffect(() => {
    setValue('isAuthenticated', isAuthenticated)

    if (currentUser) {
      setValue('firstName', currentUser.firstName)
      setValue('lastName', currentUser.lastName)
      setValue('email', currentUser.email)
    }
  }, [currentUser, isAuthenticated, setValue])

  useEffect(() => {
    if (hasAppliedUrlPreset.current) {
      return
    }

    const presetType = searchParams.get('type')
    const presetCampaignId = searchParams.get('campaignId')
    const presetStep = searchParams.get('step')

    if (presetType !== 'campaign' || !presetCampaignId || campaigns.length === 0) {
      if (!presetCampaignId || campaigns.length > 0) {
        hasAppliedUrlPreset.current = true
      }
      return
    }

    const matchedCampaign = campaigns.find((campaign) => campaign._id === presetCampaignId)

    if (!matchedCampaign) {
      hasAppliedUrlPreset.current = true
      return
    }

    setValue('donationType', 'campaign', { shouldValidate: true })
    setValue('campaign', matchedCampaign._id, { shouldValidate: true })

    const targetStep = Number(presetStep)
    if (Number.isFinite(targetStep)) {
      const normalizedStep = Math.max(1, Math.min(targetStep, steps.length)) - 1
      setCurrentStep(normalizedStep)
    }

    hasAppliedUrlPreset.current = true
  }, [campaigns, searchParams, setValue])

  const values = watch()
  const selectedPaymentMethod = values.paymentMethod ?? selectedPaymentMethodFromStore ?? null
  const requiresManualConfirmation = isManualPaymentMethod(selectedPaymentMethod)
  const manualPaymentValidation = requiresManualConfirmation
    ? manualPaymentValidationSchema.safeParse({
        paymentMethod: selectedPaymentMethod,
        reference: values.transactionReference ?? '',
        proofFileName: values.proofFileName ?? '',
        proofMimeType: values.proofMimeType ?? '',
        proofFileSize: values.proofFileSize ?? 0,
      })
    : null
  const selectedPaymentMethodDetails = useMemo(
    () => paymentMethods.find((method) => method.id === selectedPaymentMethod) ?? null,
    [paymentMethods, selectedPaymentMethod]
  )
  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => campaign._id === values.campaign) ?? null,
    [campaigns, values.campaign]
  )

  const availablePrograms = content.home.programsSection.items.map((item) => item.title)

  const daysRemaining = (campaign?: Campaign | null) => {
    if (!campaign) {
      return 0
    }

    const diff = new Date(campaign.endDate).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const handleDonationTypeChange = (donationType: DonationType) => {
    setValue('donationType', donationType, { shouldValidate: true })

    if (donationType !== 'campaign') {
      setValue('campaign', '', { shouldValidate: false })
    }

    if (donationType !== 'program') {
      setValue('program', '', { shouldValidate: false })
    }
  }

  const goNext = async () => {
    const isValid = await trigger(stepFields[currentStep])

    if (!isValid) {
      return
    }

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1))
  }

  const goBack = () => setCurrentStep((step) => Math.max(step - 1, 0))

  const resetWizard = () => {
    setSuccessDonation(null)
    setSubmissionNotice(null)
    setCurrentStep(0)
    setCustomAmountEnabled(false)
    setSelectedProofFile(null)
    dispatch(resetPaymentState())
    reset({
      donationType: 'general',
      amount: content.donatePage.presetAmounts[1] ?? 25,
      frequency: 'one_time',
      firstName: currentUser?.firstName ?? '',
      lastName: currentUser?.lastName ?? '',
      email: currentUser?.email ?? '',
      phone: '',
      country: '',
      message: '',
      anonymous: false,
      transactionReference: '',
      proofImage: '',
      proofFileName: '',
      proofMimeType: '',
      proofFileSize: 0,
      isAuthenticated,
    })
    hasAppliedUrlPreset.current = false
  }

  const onSubmit = async (formValues: DonationWizardFormValues) => {
    if (!formValues.paymentMethod) {
      toast.error('Veuillez choisir un mode de paiement.')
      return
    }

    try {
      const response = await createDonation({
        donationType: formValues.donationType,
        campaign: formValues.campaign || undefined,
        program: formValues.program || undefined,
        amount: formValues.amount,
        currency: 'USD',
        paymentMethod: formValues.paymentMethod,
        frequency: formValues.frequency,
        anonymous: formValues.anonymous,
        message: formValues.message || undefined,
        donor: isAuthenticated
          ? {
              firstName: currentUser?.firstName ?? formValues.firstName ?? '',
              lastName: currentUser?.lastName ?? formValues.lastName ?? '',
              email: currentUser?.email ?? formValues.email ?? '',
              phone: formValues.phone || undefined,
              country: formValues.country || undefined,
            }
          : {
              firstName: formValues.firstName ?? '',
              lastName: formValues.lastName ?? '',
              email: formValues.email ?? '',
              phone: formValues.phone || undefined,
              country: formValues.country || undefined,
            },
        transactionReference: requiresManualConfirmation ? undefined : formValues.transactionReference || undefined,
      }).unwrap()

      let notice: string | null = null

      if (selectedProofFile && isManualPaymentMethod(formValues.paymentMethod)) {
        try {
          await submitManualPayment({
            donationId: response.donation._id,
            reference: formValues.transactionReference || response.donation.reference,
            file: selectedProofFile.file,
          }).unwrap()

          notice =
            'Le paiement manuel a été envoyé en validation. Un administrateur doit vérifier la référence et la preuve avant confirmation.'
        } catch (proofError) {
          const proofMessage =
            typeof proofError === 'object' &&
            proofError &&
            'data' in proofError &&
            typeof proofError.data === 'object' &&
            proofError.data &&
            'message' in proofError.data &&
            typeof proofError.data.message === 'string'
              ? proofError.data.message
              : 'Le don a été créé, mais la preuve n’a pas pu être téléversée.'

          notice = `${proofMessage} Référence du don : ${response.donation.reference}.`
          toast.error(proofMessage)
        }
      }

      setSubmissionNotice(notice)
      setSuccessDonation(response.donation)
      toast.success(response.message)
    } catch (error) {
      const message =
        typeof error === 'object' &&
        error &&
        'data' in error &&
        typeof error.data === 'object' &&
        error.data &&
        'message' in error.data &&
        typeof error.data.message === 'string'
          ? error.data.message
          : 'Impossible de créer le don pour le moment.'

      toast.error(message)
    }
  }

  const nextButtonLabel =
    currentStep === 3
      ? selectedPaymentMethod === 'PAYPAL'
        ? 'Continuer vers PayPal'
        : 'Continuer'
      : currentStep === 4
        ? 'Passer à la confirmation'
        : 'Continuer'

  const isNextDisabled = currentStep === 3 && !selectedPaymentMethod
  const isSubmitDisabled =
    isLoading ||
    isSubmittingManualPayment ||
    (requiresManualConfirmation && Boolean(manualPaymentValidation && !manualPaymentValidation.success))

  if (successDonation) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-orange-100">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
            <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
          </div>
          <h2 className="mt-6 font-display text-3xl font-bold text-soft-black">
            {content.donatePage.successTitle}
          </h2>
          <p className="mt-4 text-slate-600">{content.donatePage.successDescription}</p>
          <div className="mt-8 grid gap-4 rounded-3xl bg-orange-50 p-6 text-left sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-orange-500">Référence</p>
              <p className="mt-1 font-medium text-soft-black">{successDonation.reference}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-500">Statut</p>
              <p className="mt-1 font-medium text-soft-black">{successDonation.status}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-500">Montant</p>
              <p className="mt-1 font-medium text-soft-black">{successDonation.amount} USD</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-500">Mode de paiement</p>
              <p className="mt-1 font-medium text-soft-black">
                {selectedPaymentMethod ? paymentLabels[selectedPaymentMethod] : 'À confirmer'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-500">Preuve</p>
              <p className="mt-1 font-medium text-soft-black">{successDonation.proofStatus}</p>
            </div>
          </div>
          {submissionNotice ? (
            <p className="mt-6 rounded-2xl bg-orange-50 px-4 py-3 text-sm text-slate-700">
              {submissionNotice}
            </p>
          ) : null}
          <button
            type="button"
            onClick={resetWizard}
            className="mt-8 inline-flex rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            {content.donatePage.resetLabel}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-orange-100 sm:p-8">
          <div className="flex flex-wrap gap-3">
            {steps.map((label, index) => (
              <div
                key={label}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  index === currentStep ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-500'
                }`}
              >
                {index + 1}. {label}
              </div>
            ))}
          </div>

          {currentStep === 0 ? (
            <section className="mt-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-soft-black">Choisissez le type de don</h2>
                <p className="mt-2 text-slate-600">Vous pouvez soutenir la fondation, un programme ou une campagne.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {donationTypeCards.map((card) => {
                  const Icon = card.icon
                  const active = values.donationType === card.value

                  return (
                    <button
                      key={card.value}
                      type="button"
                      onClick={() => handleDonationTypeChange(card.value)}
                      className={`rounded-3xl border p-5 text-left transition ${
                        active ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-slate-200 hover:border-orange-200'
                      }`}
                    >
                      <Icon className="h-6 w-6 text-orange-500" aria-hidden="true" />
                      <h3 className="mt-4 font-display text-lg font-semibold text-soft-black">{card.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{card.description}</p>
                    </button>
                  )
                })}
              </div>

              {values.donationType === 'program' ? (
                <div>
                  <label htmlFor="program" className="mb-2 block text-sm font-semibold text-soft-black">
                    Programme à soutenir
                  </label>
                  <select
                    id="program"
                    {...register('program')}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Sélectionnez un programme</option>
                    {availablePrograms.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                  {errors.program ? <p className="mt-2 text-sm text-red-500">{errors.program.message}</p> : null}
                </div>
              ) : null}

              {values.donationType === 'campaign' ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="campaign" className="mb-2 block text-sm font-semibold text-soft-black">
                      Campagne
                    </label>
                    <select
                      id="campaign"
                      {...register('campaign')}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Sélectionnez une campagne active</option>
                      {campaigns.map((campaign) => (
                        <option key={campaign._id} value={campaign._id}>
                          {campaign.title}
                        </option>
                      ))}
                    </select>
                    {errors.campaign ? <p className="mt-2 text-sm text-red-500">{errors.campaign.message}</p> : null}
                  </div>

                  {selectedCampaign ? (
                    <div className="overflow-hidden rounded-3xl border border-orange-100 bg-orange-50">
                      <img
                        src={selectedCampaign.image}
                        alt={selectedCampaign.title}
                        className="h-60 w-full object-cover"
                      />
                      <div className="space-y-3 p-5">
                        <h3 className="font-display text-2xl font-bold text-soft-black">{selectedCampaign.title}</h3>
                        <p className="text-slate-600">{selectedCampaign.description}</p>
                        <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                          <div>
                            <p className="font-semibold text-soft-black">Objectif</p>
                            <p>{selectedCampaign.goalAmount} USD</p>
                          </div>
                          <div>
                            <p className="font-semibold text-soft-black">Récolté</p>
                            <p>{selectedCampaign.raisedAmount} USD</p>
                          </div>
                          <div>
                            <p className="font-semibold text-soft-black">Progression</p>
                            <p>
                              {Math.min(
                                100,
                                Math.round(
                                  (selectedCampaign.raisedAmount / Math.max(selectedCampaign.goalAmount, 1)) * 100
                                )
                              )}
                              %
                            </p>
                          </div>
                          <div>
                            <p className="font-semibold text-soft-black">Jours restants</p>
                            <p>{daysRemaining(selectedCampaign)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>
          ) : null}

          {currentStep === 1 ? (
            <section className="mt-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-soft-black">Choisissez un montant</h2>
                <p className="mt-2 text-slate-600">Sélectionnez un montant rapide ou saisissez une contribution libre.</p>
              </div>

              {values.donationType === 'campaign' && selectedCampaign ? (
                <div className="overflow-hidden rounded-3xl border border-orange-100 bg-orange-50">
                  <img
                    src={selectedCampaign.image}
                    alt={selectedCampaign.title}
                    className="h-52 w-full object-cover"
                  />
                  <div className="space-y-3 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
                          Campagne préselectionnée
                        </p>
                        <h3 className="mt-2 font-display text-2xl font-bold text-soft-black">
                          {selectedCampaign.title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(0)}
                        className="inline-flex rounded-full border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-white"
                      >
                        Changer
                      </button>
                    </div>

                    <p className="text-slate-600">{selectedCampaign.description}</p>

                    <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <p className="font-semibold text-soft-black">Objectif</p>
                        <p>{selectedCampaign.goalAmount} USD</p>
                      </div>
                      <div>
                        <p className="font-semibold text-soft-black">Récolté</p>
                        <p>{selectedCampaign.raisedAmount} USD</p>
                      </div>
                      <div>
                        <p className="font-semibold text-soft-black">Progression</p>
                        <p>
                          {Math.min(
                            100,
                            Math.round((selectedCampaign.raisedAmount / Math.max(selectedCampaign.goalAmount, 1)) * 100)
                          )}
                          %
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-soft-black">Jours restants</p>
                        <p>{daysRemaining(selectedCampaign)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
                {[10, 25, 50, 100, 250, 500].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setCustomAmountEnabled(false)
                      setValue('amount', amount, { shouldValidate: true })
                    }}
                    className={`rounded-2xl border px-4 py-4 text-center font-semibold transition ${
                      values.amount === amount && !customAmountEnabled
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    {amount} USD
                  </button>
                ))}
              </div>
              <div className="rounded-3xl border border-dashed border-orange-200 p-5">
                <label className="flex items-center gap-3 text-sm font-semibold text-soft-black">
                  <input
                    type="checkbox"
                    checked={customAmountEnabled}
                    onChange={(event) => setCustomAmountEnabled(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  Autre montant
                </label>
                {customAmountEnabled ? (
                  <div className="mt-4">
                    <input
                      type="number"
                      min={1}
                      value={values.amount}
                      onChange={(event) => setValue('amount', Number(event.target.value) || 0, { shouldValidate: true })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Entrez votre montant"
                    />
                  </div>
                ) : null}
                {errors.amount ? <p className="mt-2 text-sm text-red-500">{errors.amount.message}</p> : null}
              </div>
            </section>
          ) : null}

          {currentStep === 2 ? (
            <section className="mt-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-soft-black">Choisissez la fréquence</h2>
                <p className="mt-2 text-slate-600">La base est prête pour le don unique et le don mensuel.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { value: 'one_time' as DonationFrequency, title: 'Don unique', description: 'Une contribution ponctuelle.' },
                  { value: 'monthly' as DonationFrequency, title: 'Don mensuel', description: 'Un soutien récurrent chaque mois.' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue('frequency', option.value, { shouldValidate: true })}
                    className={`rounded-3xl border p-5 text-left transition ${
                      values.frequency === option.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 hover:border-orange-200'
                    }`}
                  >
                    <Wallet className="h-6 w-6 text-orange-500" aria-hidden="true" />
                    <h3 className="mt-4 font-display text-lg font-semibold text-soft-black">{option.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{option.description}</p>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {currentStep === 3 ? (
            <section className="mt-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-soft-black">Choisir le mode de paiement</h2>
                <p className="mt-2 text-slate-600">
                  Sélectionnez un mode de paiement rassurant et adapté. Le backend reste toujours la source de vérité.
                </p>
              </div>

              <PaymentMethodSelector
                value={selectedPaymentMethod}
                onChange={(methodId) => {
                  setValue('paymentMethod', methodId, { shouldValidate: true })
                  dispatch(setSelectedPaymentMethod(methodId))
                  if (!isManualPaymentMethod(methodId)) {
                    setSelectedProofFile(null)
                    setValue('transactionReference', '')
                    setValue('proofImage', '')
                    setValue('proofFileName', '')
                    setValue('proofMimeType', '')
                    setValue('proofFileSize', 0)
                  }
                }}
                error={errors.paymentMethod?.message}
              />

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                <p className="font-semibold text-soft-black">Suite du parcours</p>
                <p className="mt-2">
                  Après le choix du moyen de paiement, vous renseignerez vos informations puis l’étape
                  <span className="font-semibold text-soft-black"> Confirmation du paiement </span>
                  vous demandera, si nécessaire, la référence de transaction et la preuve du paiement.
                </p>
              </div>
            </section>
          ) : null}

          {currentStep === 4 ? (
            <section className="mt-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-soft-black">{content.donatePage.donorInfoTitle}</h2>
                <p className="mt-2 text-slate-600">
                  {isAuthenticated
                    ? 'Vos informations principales sont préremplies. Vous pouvez compléter le reste.'
                    : 'Renseignez les informations nécessaires pour votre don.'}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { id: 'firstName', label: 'Prénom', type: 'text' },
                  { id: 'lastName', label: 'Nom', type: 'text' },
                  { id: 'email', label: 'Email', type: 'email' },
                  { id: 'phone', label: 'Téléphone (optionnel)', type: 'text' },
                  { id: 'country', label: 'Pays', type: 'text' },
                ].map((field) => (
                  <div key={field.id} className={field.id === 'email' ? 'md:col-span-2' : ''}>
                    <label htmlFor={field.id} className="mb-2 block text-sm font-semibold text-soft-black">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      {...register(field.id as keyof DonationWizardFormValues)}
                      disabled={isAuthenticated && ['firstName', 'lastName', 'email'].includes(field.id)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-50"
                    />
                    {errors[field.id as keyof typeof errors] ? (
                      <p className="mt-2 text-sm text-red-500">
                        {errors[field.id as keyof typeof errors]?.message as string}
                      </p>
                    ) : null}
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label htmlFor="message" className="mb-2 block text-sm font-semibold text-soft-black">
                    Message (optionnel)
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register('message')}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Partagez un mot d’encouragement ou l’intention de votre don."
                  />
                </div>
                <label className="md:col-span-2 flex items-center gap-3 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-medium text-soft-black">
                  <input
                    type="checkbox"
                    {...register('anonymous')}
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  Je souhaite rester anonyme.
                </label>
              </div>
            </section>
          ) : null}

          {currentStep === 5 ? (
            <section className="mt-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-soft-black">Confirmation du paiement</h2>
                <p className="mt-2 text-slate-600">
                  Vérifiez les informations ci-dessous. Pour les paiements manuels, la référence de transaction et
                  la preuve sont obligatoires avant l’envoi en validation.
                </p>
              </div>

              <PaymentInstructions
                method={selectedPaymentMethod}
                methodDetails={selectedPaymentMethodDetails}
                content={content}
                reference={values.transactionReference}
                proofImage={values.proofImage}
                proofFileName={values.proofFileName}
                onReferenceChange={(reference) =>
                  setValue('transactionReference', reference.trimStart(), { shouldValidate: true })
                }
                onProofUploaded={(payload) => {
                  setSelectedProofFile(payload)
                  setValue('proofImage', payload.previewUrl, { shouldValidate: true })
                  setValue('proofFileName', payload.fileName, { shouldValidate: true })
                  setValue('proofMimeType', payload.mimeType, { shouldValidate: true })
                  setValue('proofFileSize', payload.fileSize, { shouldValidate: true })
                }}
                referenceError={errors.transactionReference?.message}
                proofError={errors.proofImage?.message}
              />

              {requiresManualConfirmation ? (
                <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5 text-sm text-slate-700">
                  <p className="font-semibold text-soft-black">Contrôles appliqués avant validation</p>
                  <ul className="mt-3 space-y-2">
                    <li>La référence doit contenir entre 6 et 100 caractères.</li>
                    <li>Le fichier doit être au format JPG, JPEG, PNG, WEBP ou PDF.</li>
                    <li>La taille maximale autorisée est de 5 Mo.</li>
                    <li>Le paiement restera en attente jusqu’à revue par un administrateur autorisé.</li>
                  </ul>
                </div>
              ) : (
                <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5 text-sm text-slate-700">
                  <p className="font-semibold text-soft-black">Paiement en ligne ou sans preuve immédiate</p>
                  <p className="mt-2">
                    Le backend reste la source de vérité. Aucun paiement n’est marqué comme confirmé depuis le
                    navigateur.
                  </p>
                </div>
              )}
            </section>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={currentStep === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:border-orange-300 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Retour
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={isNextDisabled}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {nextButtonLabel}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading || isSubmittingManualPayment ? 'Traitement...' : 'Confirmer mon don'}
              </button>
            )}
          </div>
        </div>
      </form>

      <DonationSummary
        donationType={values.donationType}
        amount={values.amount}
        frequency={values.frequency}
        paymentMethod={selectedPaymentMethod}
        selectedProgram={values.program}
        selectedCampaign={selectedCampaign}
      />
    </div>
  )
}

export default DonationWizard
