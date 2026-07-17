import { Link, Navigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Calendar, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ResilientImage from '../components/common/ResilientImage'
import { useGetPublicNewsByIdQuery, useGetPublicNewsQuery } from '../features/news/newsApi'

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { data: article, isLoading, isError } = useGetPublicNewsByIdQuery(id ?? '', {
    skip: !id,
  })
  const { data: news = [] } = useGetPublicNewsQuery()

  if (!id) {
    return <Navigate to="/actualites" replace />
  }

  if (isLoading) {
    return (
      <section className="min-h-[50vh] bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <LoadingSpinner label="Chargement de l'actualité..." className="justify-start" />
        </div>
      </section>
    )
  }

  if (isError || !article) {
    return (
      <>
        <Helmet>
          <title>Actualité introuvable - Fondation Bien Aimé Cassis</title>
        </Helmet>

        <section className="bg-slate-50 px-4 py-16">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-md">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-500">Actualités</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-soft-black">Actualité introuvable</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Cette publication n&apos;est plus disponible ou son identifiant est invalide.
            </p>
            <Link
              to="/actualites"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux actualités
            </Link>
          </div>
        </section>
      </>
    )
  }

  const relatedNews = news.filter((item) => item._id !== article._id).slice(0, 3)

  return (
    <>
      <Helmet>
        <title>{article.title} - Fondation Bien Aimé Cassis</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/actualites"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux actualités
          </Link>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-500">Actualités</p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold text-soft-black md:text-5xl">
              {article.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(article.createdAt)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {article.views} vue{article.views > 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <article className="overflow-hidden rounded-3xl bg-white shadow-md">
            <ResilientImage
              src={article.image}
              alt={article.title}
              className="h-64 w-full object-cover md:h-[420px]"
              fallbackClassName="h-64 w-full md:h-[420px]"
              fallbackLabel="Image de l'actualité indisponible"
            />

            <div className="space-y-6 p-6 sm:p-8 md:p-10">
              <p className="text-lg font-medium leading-8 text-slate-700">{article.excerpt}</p>
              <div className="h-px bg-slate-100" />
              <div className="whitespace-pre-line text-base leading-8 text-slate-600">{article.content}</div>
            </div>
          </article>
        </div>
      </section>

      {relatedNews.length > 0 && (
        <section className="bg-slate-50 py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-500">À lire aussi</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-soft-black">Autres actualités</h2>
              </div>
              <Link
                to="/actualites"
                className="hidden text-sm font-semibold text-orange-600 transition hover:text-orange-700 sm:inline-flex"
              >
                Voir toutes les actualités
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedNews.map((item) => (
                <article key={item._id} className="overflow-hidden rounded-2xl bg-white shadow-md">
                  <ResilientImage
                    src={item.image}
                    alt={item.title}
                    className="h-44 w-full object-cover"
                    fallbackClassName="h-44 w-full"
                    fallbackLabel="Image de l'actualité indisponible"
                  />
                  <div className="space-y-3 p-5">
                    <p className="text-sm text-slate-500">{formatDate(item.createdAt)}</p>
                    <h3 className="font-display text-xl font-semibold text-soft-black">{item.title}</h3>
                    <p className="line-clamp-3 text-sm leading-6 text-slate-600">{item.excerpt}</p>
                    <Link
                      to={`/actualites/${item._id}`}
                      className="inline-flex items-center gap-2 font-semibold text-orange-500 transition hover:text-orange-600"
                    >
                      Lire la suite
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default NewsDetail
