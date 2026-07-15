import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon, Newspaper, PencilLine, Plus, Star, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import AdminShell from '../../components/admin/AdminShell'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAppSelector } from '../../app/hooks'
import {
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useGetAdminNewsQuery,
  useUpdateNewsMutation,
} from '../../features/news/newsApi'
import type { NewsCategory, NewsItem, NewsStatus } from '../../features/news/newsTypes'
import { selectCurrentUser } from '../../features/auth/authSelectors'

const newsCategoryOptions: Array<{ value: NewsCategory; label: string }> = [
  { value: 'news', label: 'Actualité' },
  { value: 'event', label: 'Événement' },
  { value: 'success', label: 'Réussite' },
  { value: 'report', label: 'Rapport' },
]

const newsStatusOptions: Array<{ value: NewsStatus; label: string }> = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'published', label: 'Publié' },
]

const newsSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  excerpt: z.string().min(20, 'Le résumé doit contenir au moins 20 caractères').max(300, 'Le résumé doit rester sous 300 caractères'),
  content: z.string().min(50, 'Le contenu doit contenir au moins 50 caractères'),
  image: z.string().url("Veuillez saisir une URL d'image valide"),
  category: z.enum(['news', 'event', 'success', 'report']),
  isFeatured: z.boolean(),
  status: z.enum(['draft', 'published']),
})

type NewsFormValues = z.infer<typeof newsSchema>

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

const formatDateDisplay = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

const getAuthorLabel = (author: NewsItem['author']) => {
  if (!author) {
    return 'Auteur non renseigné'
  }

  if (typeof author === 'string') {
    return author
  }

  return `${author.firstName} ${author.lastName}`
}

const hasNewsAccess = (permissions: string[] | undefined) =>
  Boolean(
    permissions?.includes('*') ||
      permissions?.includes('news.create') ||
      permissions?.includes('news.update') ||
      permissions?.includes('news.delete')
  )

const AdminNewsPage = () => {
  const user = useAppSelector(selectCurrentUser)
  const canManageNews = hasNewsAccess(user?.permissions)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)

  const { data: news = [], isLoading, isFetching } = useGetAdminNewsQuery(undefined, {
    skip: !canManageNews,
  })
  const [createNews, { isLoading: isCreating }] = useCreateNewsMutation()
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation()
  const [deleteNews, { isLoading: isDeleting }] = useDeleteNewsMutation()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      image: '',
      category: 'news',
      isFeatured: false,
      status: 'draft',
    },
  })

  useEffect(() => {
    if (!editingNews) {
      reset({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category: 'news',
        isFeatured: false,
        status: 'draft',
      })
      return
    }

    reset({
      title: editingNews.title,
      excerpt: editingNews.excerpt,
      content: editingNews.content,
      image: editingNews.image,
      category: editingNews.category,
      isFeatured: editingNews.isFeatured,
      status: editingNews.status,
    })
  }, [editingNews, reset])

  const imagePreview = watch('image')

  const onSubmit = async (values: NewsFormValues) => {
    try {
      if (editingNews) {
        await updateNews({
          id: editingNews._id,
          payload: values,
        }).unwrap()
        toast.success('Publication mise à jour avec succès.')
      } else {
        await createNews(values).unwrap()
        toast.success('Publication créée avec succès.')
      }

      setEditingNews(null)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  const handleDelete = async (newsItem: NewsItem) => {
    const confirmed = window.confirm(`Supprimer la publication "${newsItem.title}" ?`)

    if (!confirmed) {
      return
    }

    try {
      await deleteNews(newsItem._id).unwrap()
      if (editingNews?._id === newsItem._id) {
        setEditingNews(null)
      }
      toast.success('Publication supprimée.')
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  if (!canManageNews) {
    return (
      <AdminShell
        title="Gestion des publications"
        description="Créez des actualités, laissez-les en brouillon ou publiez-les quand elles sont prêtes."
      >
        <div className="rounded-3xl bg-white p-8 shadow-panel">
          <p className="text-sm leading-6 text-slate-600">
            Votre compte ne dispose pas des permissions nécessaires pour gérer les publications.
          </p>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Gestion des publications"
      description="Rédigez les actualités de la fondation, choisissez leur statut et gérez leur image principale via URL."
      actions={
        <Button variant="secondary" onClick={() => setEditingNews(null)}>
          <Plus className="h-4 w-4" />
          Nouvelle publication
        </Button>
      }
    >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <section className="rounded-3xl bg-white p-6 shadow-panel">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold text-slate-900">
                {editingNews ? 'Modifier la publication' : 'Créer une publication'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Utilisez le statut brouillon pour préparer votre contenu avant publication.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Input
                id="news-title"
                label="Titre"
                placeholder="Lancement de la campagne de rentrée"
                error={errors.title?.message}
                {...register('title')}
              />

              <div className="space-y-2">
                <label htmlFor="news-excerpt" className="block text-sm font-medium text-slate-700">
                  Résumé
                </label>
                <textarea
                  id="news-excerpt"
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                  placeholder="Résumé court affiché sur la page des actualités."
                  {...register('excerpt')}
                />
                {errors.excerpt ? (
                  <p className="text-sm text-red-600">{errors.excerpt.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="news-content" className="block text-sm font-medium text-slate-700">
                  Contenu
                </label>
                <textarea
                  id="news-content"
                  rows={10}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                  placeholder="Contenu complet de la publication."
                  {...register('content')}
                />
                {errors.content ? (
                  <p className="text-sm text-red-600">{errors.content.message}</p>
                ) : null}
              </div>

              <Input
                id="news-image"
                type="url"
                label="URL de l'image"
                placeholder="https://..."
                error={errors.image?.message}
                leftIcon={<ImageIcon className="h-5 w-5" />}
                {...register('image')}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="news-category" className="block text-sm font-medium text-slate-700">
                    Catégorie
                  </label>
                  <select
                    id="news-category"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                    {...register('category')}
                  >
                    {newsCategoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="news-status" className="block text-sm font-medium text-slate-700">
                    Statut
                  </label>
                  <select
                    id="news-status"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
                    {...register('status')}
                  >
                    {newsStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  {...register('isFeatured')}
                />
                Mettre en avant cette publication
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" isLoading={isCreating || isUpdating}>
                  {editingNews ? 'Enregistrer les modifications' : 'Créer la publication'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditingNews(null)}>
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
                    alt="Aperçu de la publication"
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
                <Newspaper className="h-5 w-5 text-orange-500" />
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  Publications existantes
                </h3>
              </div>

              {isLoading || isFetching ? (
                <p className="text-sm text-slate-500">Chargement des publications...</p>
              ) : news.length === 0 ? (
                <p className="text-sm text-slate-500">Aucune publication disponible pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {news.map((newsItem) => (
                    <article
                      key={newsItem._id}
                      className="overflow-hidden rounded-2xl border border-slate-200"
                    >
                      <img
                        src={newsItem.image}
                        alt={newsItem.title}
                        className="h-36 w-full object-cover"
                      />
                      <div className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-slate-900">{newsItem.title}</h4>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatDateDisplay(newsItem.createdAt)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                              {newsStatusOptions.find((option) => option.value === newsItem.status)?.label}
                            </span>
                            {newsItem.isFeatured ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                <Star className="h-3.5 w-3.5" />
                                Mise en avant
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <p className="text-sm leading-6 text-slate-600">{newsItem.excerpt}</p>

                        <div className="grid gap-2 text-sm text-slate-600">
                          <p>
                            <span className="font-medium text-slate-900">Auteur :</span>{' '}
                            {getAuthorLabel(newsItem.author)}
                          </p>
                          <p>
                            <span className="font-medium text-slate-900">Vues :</span> {newsItem.views}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            variant="secondary"
                            className="sm:flex-1"
                            onClick={() => setEditingNews(newsItem)}
                          >
                            <PencilLine className="h-4 w-4" />
                            Modifier
                          </Button>
                          <Button
                            variant="danger"
                            className="sm:flex-1"
                            isLoading={isDeleting}
                            onClick={() => handleDelete(newsItem)}
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

export default AdminNewsPage
