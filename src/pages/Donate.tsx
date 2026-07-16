import { Helmet } from 'react-helmet-async'
import DonationWizard from '../components/donations/DonationWizard'
import { useSiteContent } from '../features/siteContent/useSiteContent'

const Donate = () => {
  const { content } = useSiteContent()

  return (
    <>
      <Helmet>
        <title>{content.donatePage.seoTitle}</title>
        <meta name="description" content={content.donatePage.seoDescription} />
        <meta property="og:title" content={content.donatePage.seoTitle} />
        <meta property="og:description" content={content.donatePage.seoDescription} />
      </Helmet>

      <section className="bg-gradient-to-br from-orange-50 to-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">Faire un don</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-soft-black sm:text-5xl">
              {content.donatePage.heroTitle}
            </h1>
            <p className="mt-5 text-lg text-slate-600 sm:text-xl">{content.donatePage.heroDescription}</p>
          </div>

          <div className="mt-12">
            <DonationWizard />
          </div>
        </div>
      </section>
    </>
  )
}

export default Donate
