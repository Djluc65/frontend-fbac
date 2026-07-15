import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDays, ImageIcon, Megaphone, PencilLine, Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import AdminShell from '../../components/admin/AdminShell'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAppSelector } from '../../app/hooks'
import {
  useCreateCampaignMutation,
  useDeleteCampaignMutation,
  useGetCampaignsQuery,
  useUpdateCampaignMutation,
} from '../../features/campaigns/campaignApi'
import type { Campaign, CampaignCategory, CampaignStatus } from '../../features/campaigns/campaignTypes'
import { selectCurrentUser } from '../../features/auth/authSelectors'

const campaignStatusOptions: Array<{ value: CampaignStatus; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Terminée' },
  { value: 'paused', label: 'En pause' },
]

const campaignCategoryOptions: Array<{ value: CampaignCategory; label: string }> = [
  { value: 'education', label: 'Éducation' },
  { value: 'food', label: 'Alimentation' },
  { value: 'clothing', label: 'Vêtements' },
  { value: 'health', label: 'Santé' },
  { value: 'community', label: 'Communauté' },
  { value: 'other', label: 'Autre' },
]

const campaignSchema = z
  .object({
    title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
    description: z.string().min(20, 'La description doit contenir au moins 20 caractères'),
    goalAmount: z.coerce.number().min(0, "L'objectif financier doit être positif"),
    raisedAmount: z.coerce.number().min(0, 'Le montant collecté doit être positif'),
    image: z.string().url("Veuillez saisir une URL d'image valide"),
    startDate: z.string().min(1, 'La date de début est requise'),
    endDate: z.string().min(1, 'La date de fin est requise'),
    status: z.enum(['active', 'completed', 'paused']),
    category: z.enum(['education', 'food', 'clothing', 'health', 'community', 'other']),
  })
  .refine((values) => new Date(values.endDate) >= new Date(values.startDate), {
    message: 'La date de fin doit être postérieure à la date de début',
    path: ['endDate'],
  })

type CampaignFormValues = z.infer<typeof campaignSchema>

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

const formatDateInput = (value?: string) => {
  if (!value) {
    return ''
  }

  return new Date(value).toISOString().slice(0, 10)
}

const formatDateDisplay = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
  }).format(new Date(value))

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const hasCampaignAccess = (permissions: string[] | undefined) =>
  Boolean(permissions?.includes('*') || permissions?.includes('campaigns.manage'))

const AdminCampaignsPage = () => {
  const user = useAppSelector(selectCurrentUser)
  const canManageCampaigns = hasCampaignAccess(user?.permissions)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const defaultStartDate = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const defaultEndDate = useMemo(() => {
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return nextMonth.toISOString().slice(0, 10)
  }, [])

  const { data: campaigns = [], isLoading, isFetching } = useGetCampaignsQuery(undefined, {
    skip: !canManageCampaigns,
  })
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation()
  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation()
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: '',
      description: '',
      goalAmount: 0,
      raisedAmount: 0,
      image: '',
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      status: 'active',
      category: 'education',
    },
  })

  useEffect(() => {
    if (!editingCampaign) {
      reset({
        title: '',
        description: '',
        goalAmount: 0,
        raisedAmount: 0,
        image: '',
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        status: 'active',
        category: 'education',
      })
      return
    }

    reset({
      title: editingCampaign.title,
      description: editingCampaign.description,
      goalAmount: editingCampaign.goalAmount,
      raisedAmount: editingCampaign.raisedAmount,
      image: editingCampaign.image,
      startDate: formatDateInput(editingCampaign.startDate),
      endDate: formatDateInput(editingCampaign.endDate),
      status: editingCampaign.status,
      category: editingCampaign.category,
    })
  }, [defaultEndDate, defaultStartDate, editingCampaign, reset])

  const imagePreview = watch('image')

  const onSubmit = async (values: CampaignFormValues) => {
    try {
      if (editingCampaign) {
        await updateCampaign({
          id: editingCampaign._id,
          payload: values,
        }).unwrap()
        toast.success('Campagne mise à jour avec succès.')
      } else {
        await createCampaign(values).unwrap()
        toast.success('Campagne créée avec succès.')
      }

      setEditingCampaign(null)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  const handleDelete = async (campaign: Campaign) => {
    const confirmed = window.confirm(`Supprimer la campagne "${campaign.title}" ?`)

    if (!confirmed) {
      return
    }

    try {
      await deleteCampaign(campaign._id).unwrap()
      if (editingCampaign?._id === campaign._id) {
        setEditingCampaign(null)
      }
      toast.success('Campagne supprimée.')
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  if (!canManageCampaigns) {
    return (
      <AdminShell
        title="Gestion des campagnes"
        description="Créez, mettez à jour ou archivez les campagnes de la fondation."
      >
        <div className="rounded-3xl bg-white p-8 shadow-panel">
          <p className="text-sm leading-6 text-slate-600">
            Votre compte ne dispose pas de la permission <code>campaigns.manage</code>.
          </p>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Gestion des campagnes"
      description="Ajoutez de nouvelles campagnes, modifiez les campagnes existantes et gérez leurs images via URL."
      actions={
        <Button variant="secondary" onClick={() => setEditingCampaign(null)}>
          <Plus className="h-4 w-4" />
          Nouvelle campagne
        </Button>
      }
    >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <section className="rounded-3xl bg-white p-6 shadow-panel">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-slate-900">
                  {editingCampaign ? 'Modifier la campagne' : 'Créer une campagne'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  L'image est gérée par URL pour cette première version.
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Input
                id="campaign-title"
                label="Titre"
                placeholder="Rentrée scolaire 2026"
                error={errors.title?.message}
                {...register('title')}
              />

              <div className="space-y-2">
                <label htmlFor="campaign-description" className="block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  id="campaign-description"
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                  placeholder="Décrivez l'objectif et l'impact attendu de la campagne."
                  {...register('description')}
                />
                {errors.description ? (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="campaign-goal"
                  type="number"
                  min="0"
                  step="1"
                  label="Objectif financier"
                  error={errors.goalAmount?.message}
                  {...register('goalAmount')}
                />
                <Input
                  id="campaign-raised"
                  type="number"
                  min="0"
                  step="1"
                  label="Montant collecté"
                  error={errors.raisedAmount?.message}
                  {...register('raisedAmount')}
                />
              </div>

              <Input
                id="campaign-image"
                type="url"
                label="URL de l'image"
                placeholder="https://..."
                error={errors.image?.message}
                leftIcon={<ImageIcon className="h-5 w-5" />}
                {...register('image')}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="campaign-start-date"
                  type="date"
                  label="Date de début"
                  error={errors.startDate?.message}
                  leftIcon={<CalendarDays className="h-5 w-5" />}
                  {...register('startDate')}
                />
                <Input
                  id="campaign-end-date"
                  type="date"
                  label="Date de fin"
                  error={errors.endDate?.message}
                  leftIcon={<CalendarDays className="h-5 w-5" />}
                  {...register('endDate')}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="campaign-status" className="block text-sm font-medium text-slate-700">
                    Statut
                  </label>
                  <select
                    id="campaign-status"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                    {...register('status')}
                  >
                    {campaignStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="campaign-category" className="block text-sm font-medium text-slate-700">
                    Catégorie
                  </label>
                  <select
                    id="campaign-category"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                    {...register('category')}
                  >
                    {campaignCategoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" isLoading={isCreating || isUpdating}>
                  {editingCampaign ? 'Enregistrer les modifications' : 'Créer la campagne'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingCampaign(null)}
                >
                  Réinitialiser
                </Button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <article className="rounded-3xl bg-white p-6 shadow-panel">
              <h3 className="font-display text-xl font-semibold text-slate-900">Aperçu image</h3>
              <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Aperçu de la campagne"
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-slate-400">
                    Ajoutez une URL d'image pour voir l'aperçu.
                  </div>
                )}
              </div>
            </article>

            <article className="rounded-3xl bg-white p-6 shadow-panel">
              <div className="mb-4 flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-orange-500" />
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  Campagnes existantes
                </h3>
              </div>

              {isLoading || isFetching ? (
                <p className="text-sm text-slate-500">Chargement des campagnes...</p>
              ) : campaigns.length === 0 ? (
                <p className="text-sm text-slate-500">Aucune campagne enregistrée pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <article
                      key={campaign._id}
                      className="overflow-hidden rounded-2xl border border-slate-200"
                    >
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="h-36 w-full object-cover"
                      />
                      <div className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-slate-900">{campaign.title}</h4>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatDateDisplay(campaign.startDate)} - {formatDateDisplay(campaign.endDate)}
                            </p>
                          </div>
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                            {campaignStatusOptions.find((option) => option.value === campaign.status)?.label}
                          </span>
                        </div>

                        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                          {campaign.description}
                        </p>

                        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                          <p>
                            <span className="font-medium text-slate-900">Objectif :</span>{' '}
                            {formatCurrency(campaign.goalAmount)}
                          </p>
                          <p>
                            <span className="font-medium text-slate-900">Collecté :</span>{' '}
                            {formatCurrency(campaign.raisedAmount)}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            variant="secondary"
                            className="sm:flex-1"
                            onClick={() => setEditingCampaign(campaign)}
                          >
                            <PencilLine className="h-4 w-4" />
                            Modifier
                          </Button>
                          <Button
                            variant="danger"
                            className="sm:flex-1"
                            isLoading={isDeleting}
                            onClick={() => handleDelete(campaign)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </article>
          </aside>
        </div>
      </AdminShell>
  )
}

export default AdminCampaignsPage
