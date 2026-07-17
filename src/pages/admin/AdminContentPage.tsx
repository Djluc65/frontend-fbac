import { useEffect, useState, type ChangeEvent, type TextareaHTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FilePenLine, ImagePlus, LoaderCircle, Plus, Save, Trash2, Upload } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentUser } from '../../features/auth/authSelectors'
import { defaultSiteContent } from '../../features/siteContent/defaultSiteContent'
import {
  useGetAdminSiteContentQuery,
  useUploadSiteContentImageMutation,
  useUpdateSiteContentMutation,
} from '../../features/siteContent/siteContentApi'
import type { SiteContent } from '../../features/siteContent/siteContentTypes'

type ContentFormValues = {
  navbarSiteName: string
  navbarLogoUrl: string
  navbarDonateLabel: string
  navbarDonateLink: string
  navbarLinksText: string
  footerBrandTitle: string
  footerDescription: string
  footerAddress: string
  footerPhone: string
  footerEmail: string
  footerSocialLinksText: string
  footerQuickLinksText: string
  footerEngagementLinksText: string
  footerLegalLinksText: string
  footerCopyright: string
  homeSeoTitle: string
  homeSeoDescription: string
  homeHeroTitlePrefix: string
  homeHeroTitleHighlight: string
  homeHeroDescription: string
  homeHeroPrimaryButtonLabel: string
  homeHeroPrimaryButtonLink: string
  homeHeroSecondaryButtonLabel: string
  homeHeroSecondaryButtonLink: string
  homeHeroImageUrl: string
  homeHeroImageAlt: string
  homeStatsText: string
  homeStatsDisclaimer: string
  homeProgramsTitle: string
  homeProgramsDescription: string
  homeProgramsItemsText: string
  homeCampaignsTitle: string
  homeCampaignsDescription: string
  homeAllCampaignsLabel: string
  homeAllCampaignsLink: string
  homeCampaignsDonateLabel: string
  homeCampaignsDonateLink: string
  homeCtaTitle: string
  homeCtaDescription: string
  homeCtaButtonLabel: string
  homeCtaButtonLink: string
  homeTrustTitle: string
  homeTrustDescription: string
  homeTrustImageUrl: string
  homeTrustImageAlt: string
  homeTrustReportLabel: string
  homeTrustReportLink: string
  homeTrustItemsText: string
  aboutSeoTitle: string
  aboutSeoDescription: string
  aboutHeroTitle: string
  aboutHeroDescription: string
  aboutStoryTitle: string
  aboutStoryImageUrl: string
  aboutStoryImageAlt: string
  aboutStoryParagraphsText: string
  aboutMissionTitle: string
  aboutMissionDescription: string
  aboutVisionTitle: string
  aboutVisionDescription: string
  aboutValuesTitle: string
  aboutValuesDescription: string
  aboutValuesText: string
  aboutTeamTitle: string
  aboutTeamDescription: string
  aboutTeamText: string
  programsSeoTitle: string
  programsSeoDescription: string
  programsHeroTitle: string
  programsHeroDescription: string
  programsItemsText: string
  programsImpactTitle: string
  programsImpactParagraphsText: string
  programsImpactStatsText: string
  contactSeoTitle: string
  contactSeoDescription: string
  contactHeroTitle: string
  contactHeroDescription: string
  contactInfoTitle: string
  contactInfoDescription: string
  contactFormTitle: string
  contactSubmitLabel: string
  contactSuccessMessage: string
  contactAddressLabel: string
  contactAddress: string
  contactPhoneLabel: string
  contactPhone: string
  contactEmailLabel: string
  contactEmail: string
  transparencySeoTitle: string
  transparencySeoDescription: string
  transparencyHeroTitle: string
  transparencyHeroDescription: string
  transparencyPrinciplesTitle: string
  transparencyPrinciplesDescription: string
  transparencyPrinciplesText: string
  transparencyAllocationTitle: string
  transparencyAllocationDescription: string
  transparencyAllocationItemsText: string
  transparencyReportsTitle: string
  transparencyReportsDescription: string
  transparencyReportsText: string
  transparencyImpactStatsText: string
  transparencyStatsDisclaimer: string
  donateSeoTitle: string
  donateSeoDescription: string
  donateHeroTitle: string
  donateHeroDescription: string
  donateImpactTitle: string
  donateOneTimeLabel: string
  donateMonthlyLabel: string
  donatePresetAmountsText: string
  donateImpactRulesText: string
  donateDonorInfoTitle: string
  donatePaymentTitle: string
  donatePaymentNotice: string
  donateSuccessTitle: string
  donateSuccessDescription: string
  donateSubmitLabel: string
  donateResetLabel: string
  campaignsSeoTitle: string
  campaignsSeoDescription: string
  campaignsHeroTitle: string
  campaignsHeroDescription: string
  campaignsDonateLabel: string
  newsSeoTitle: string
  newsSeoDescription: string
  newsHeroTitle: string
  newsHeroDescription: string
  newsReadMoreLabel: string
  settingsDefaultLanguage: string
  settingsSupportedLanguagesText: string
}

const hasContentAccess = (permissions: string[] | undefined) =>
  Boolean(permissions?.includes('*') || permissions?.includes('content.manage'))

const splitLines = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

const serializeLinks = (items: Array<{ label: string; path?: string; href?: string }>) =>
  items.map((item) => `${item.label} | ${item.path ?? item.href ?? ''}`).join('\n')

const parseSiteLinks = (value: string) =>
  splitLines(value).map((line) => {
    const [label = '', path = ''] = line.split('|').map((part) => part.trim())
    return { label, path }
  })

const parseSocialLinks = (value: string) =>
  splitLines(value).map((line) => {
    const [label = '', href = ''] = line.split('|').map((part) => part.trim())
    return { label, href }
  })

const serializeStats = (items: Array<{ value: string; label: string }>) =>
  items.map((item) => `${item.value} | ${item.label}`).join('\n')

const parseStats = (value: string) =>
  splitLines(value).map((line) => {
    const [statValue = '', label = ''] = line.split('|').map((part) => part.trim())
    return { value: statValue, label }
  })

const serializePairs = (items: Array<{ title: string; description: string }>) =>
  items.map((item) => `${item.title} | ${item.description}`).join('\n')

const parsePairs = (value: string) =>
  splitLines(value).map((line) => {
    const [title = '', description = ''] = line.split('|').map((part) => part.trim())
    return { title, description }
  })

const serializeTeam = (items: Array<{ name: string; role: string; imageUrl: string }>) =>
  items.map((item) => `${item.name} | ${item.role} | ${item.imageUrl}`).join('\n')

const parseTeam = (value: string) =>
  splitLines(value).map((line) => {
    const [name = '', role = '', imageUrl = ''] = line.split('|').map((part) => part.trim())
    return { name, role, imageUrl }
  })

const serializePrograms = (items: Array<{ title: string; description: string; features: string[] }>) =>
  items.map((item) => `${item.title} | ${item.description} | ${item.features.join(', ')}`).join('\n')

const parsePrograms = (value: string) =>
  splitLines(value).map((line) => {
    const [title = '', description = '', features = ''] = line.split('|').map((part) => part.trim())
    return {
      title,
      description,
      features: features
        .split(',')
        .map((feature) => feature.trim())
        .filter(Boolean),
    }
  })

const serializeAllocationItems = (items: Array<{ name: string; value: number; color: string }>) =>
  items.map((item) => `${item.name} | ${item.value} | ${item.color}`).join('\n')

const parseAllocationItems = (value: string) =>
  splitLines(value).map((line) => {
    const [name = '', amount = '0', color = '#f97316'] = line.split('|').map((part) => part.trim())
    return {
      name,
      value: Number(amount) || 0,
      color,
    }
  })

const serializeReports = (items: Array<{ year: number; title: string; download: string; status: string }>) =>
  items.map((item) => `${item.year} | ${item.title} | ${item.download} | ${item.status}`).join('\n')

const parseReports = (value: string) =>
  splitLines(value).map((line) => {
    const [year = '0', title = '', download = '', status = 'Disponible'] = line
      .split('|')
      .map((part) => part.trim())
    return {
      year: Number(year) || 0,
      title,
      download,
      status,
    }
  })

const serializeImpactRules = (items: Array<{ threshold: number; label: string }>) =>
  items.map((item) => `${item.threshold} | ${item.label}`).join('\n')

const parseImpactRules = (value: string) =>
  splitLines(value).map((line) => {
    const [threshold = '0', label = ''] = line.split('|').map((part) => part.trim())
    return {
      threshold: Number(threshold) || 0,
      label,
    }
  })

const toFormValues = (content: SiteContent): ContentFormValues => ({
  navbarSiteName: content.navbar.siteName,
  navbarLogoUrl: content.navbar.logoUrl,
  navbarDonateLabel: content.navbar.donateLabel,
  navbarDonateLink: content.navbar.donateLink,
  navbarLinksText: serializeLinks(content.navbar.links),
  footerBrandTitle: content.footer.brandTitle,
  footerDescription: content.footer.description,
  footerAddress: content.footer.contact.address,
  footerPhone: content.footer.contact.phone,
  footerEmail: content.footer.contact.email,
  footerSocialLinksText: serializeLinks(content.footer.socialLinks),
  footerQuickLinksText: serializeLinks(content.footer.quickLinks),
  footerEngagementLinksText: serializeLinks(content.footer.engagementLinks),
  footerLegalLinksText: serializeLinks(content.footer.legalLinks),
  footerCopyright: content.footer.copyright,
  homeSeoTitle: content.home.seoTitle,
  homeSeoDescription: content.home.seoDescription,
  homeHeroTitlePrefix: content.home.hero.titlePrefix,
  homeHeroTitleHighlight: content.home.hero.titleHighlight,
  homeHeroDescription: content.home.hero.description,
  homeHeroPrimaryButtonLabel: content.home.hero.primaryButtonLabel,
  homeHeroPrimaryButtonLink: content.home.hero.primaryButtonLink,
  homeHeroSecondaryButtonLabel: content.home.hero.secondaryButtonLabel,
  homeHeroSecondaryButtonLink: content.home.hero.secondaryButtonLink,
  homeHeroImageUrl: content.home.hero.imageUrl,
  homeHeroImageAlt: content.home.hero.imageAlt,
  homeStatsText: serializeStats(content.home.stats),
  homeStatsDisclaimer: content.home.statsDisclaimer,
  homeProgramsTitle: content.home.programsSection.title,
  homeProgramsDescription: content.home.programsSection.description,
  homeProgramsItemsText: serializePairs(content.home.programsSection.items),
  homeCampaignsTitle: content.home.campaignsSection.title,
  homeCampaignsDescription: content.home.campaignsSection.description,
  homeAllCampaignsLabel: content.home.campaignsSection.allCampaignsLabel,
  homeAllCampaignsLink: content.home.campaignsSection.allCampaignsLink,
  homeCampaignsDonateLabel: content.home.campaignsSection.donateLabel,
  homeCampaignsDonateLink: content.home.campaignsSection.donateLink,
  homeCtaTitle: content.home.ctaSection.title,
  homeCtaDescription: content.home.ctaSection.description,
  homeCtaButtonLabel: content.home.ctaSection.buttonLabel,
  homeCtaButtonLink: content.home.ctaSection.buttonLink,
  homeTrustTitle: content.home.trustSection.title,
  homeTrustDescription: content.home.trustSection.description,
  homeTrustImageUrl: content.home.trustSection.imageUrl,
  homeTrustImageAlt: content.home.trustSection.imageAlt,
  homeTrustReportLabel: content.home.trustSection.reportLabel,
  homeTrustReportLink: content.home.trustSection.reportLink,
  homeTrustItemsText: content.home.trustSection.items.join('\n'),
  aboutSeoTitle: content.about.seoTitle,
  aboutSeoDescription: content.about.seoDescription,
  aboutHeroTitle: content.about.heroTitle,
  aboutHeroDescription: content.about.heroDescription,
  aboutStoryTitle: content.about.storyTitle,
  aboutStoryImageUrl: content.about.storyImageUrl,
  aboutStoryImageAlt: content.about.storyImageAlt,
  aboutStoryParagraphsText: content.about.storyParagraphs.join('\n'),
  aboutMissionTitle: content.about.missionTitle,
  aboutMissionDescription: content.about.missionDescription,
  aboutVisionTitle: content.about.visionTitle,
  aboutVisionDescription: content.about.visionDescription,
  aboutValuesTitle: content.about.valuesTitle,
  aboutValuesDescription: content.about.valuesDescription,
  aboutValuesText: serializePairs(content.about.values),
  aboutTeamTitle: content.about.teamTitle,
  aboutTeamDescription: content.about.teamDescription,
  aboutTeamText: serializeTeam(content.about.team),
  programsSeoTitle: content.programsPage.seoTitle,
  programsSeoDescription: content.programsPage.seoDescription,
  programsHeroTitle: content.programsPage.heroTitle,
  programsHeroDescription: content.programsPage.heroDescription,
  programsItemsText: serializePrograms(content.programsPage.programs),
  programsImpactTitle: content.programsPage.impactTitle,
  programsImpactParagraphsText: content.programsPage.impactParagraphs.join('\n'),
  programsImpactStatsText: serializeStats(content.programsPage.impactStats),
  contactSeoTitle: content.contactPage.seoTitle,
  contactSeoDescription: content.contactPage.seoDescription,
  contactHeroTitle: content.contactPage.heroTitle,
  contactHeroDescription: content.contactPage.heroDescription,
  contactInfoTitle: content.contactPage.infoTitle,
  contactInfoDescription: content.contactPage.infoDescription,
  contactFormTitle: content.contactPage.formTitle,
  contactSubmitLabel: content.contactPage.submitLabel,
  contactSuccessMessage: content.contactPage.successMessage,
  contactAddressLabel: content.contactPage.addressLabel,
  contactAddress: content.contactPage.address,
  contactPhoneLabel: content.contactPage.phoneLabel,
  contactPhone: content.contactPage.phone,
  contactEmailLabel: content.contactPage.emailLabel,
  contactEmail: content.contactPage.email,
  transparencySeoTitle: content.transparencyPage.seoTitle,
  transparencySeoDescription: content.transparencyPage.seoDescription,
  transparencyHeroTitle: content.transparencyPage.heroTitle,
  transparencyHeroDescription: content.transparencyPage.heroDescription,
  transparencyPrinciplesTitle: content.transparencyPage.principlesTitle,
  transparencyPrinciplesDescription: content.transparencyPage.principlesDescription,
  transparencyPrinciplesText: serializePairs(content.transparencyPage.principles),
  transparencyAllocationTitle: content.transparencyPage.allocationTitle,
  transparencyAllocationDescription: content.transparencyPage.allocationDescription,
  transparencyAllocationItemsText: serializeAllocationItems(content.transparencyPage.allocationItems),
  transparencyReportsTitle: content.transparencyPage.reportsTitle,
  transparencyReportsDescription: content.transparencyPage.reportsDescription,
  transparencyReportsText: serializeReports(content.transparencyPage.reports),
  transparencyImpactStatsText: serializeStats(content.transparencyPage.impactStats),
  transparencyStatsDisclaimer: content.transparencyPage.statsDisclaimer,
  donateSeoTitle: content.donatePage.seoTitle,
  donateSeoDescription: content.donatePage.seoDescription,
  donateHeroTitle: content.donatePage.heroTitle,
  donateHeroDescription: content.donatePage.heroDescription,
  donateImpactTitle: content.donatePage.impactTitle,
  donateOneTimeLabel: content.donatePage.oneTimeLabel,
  donateMonthlyLabel: content.donatePage.monthlyLabel,
  donatePresetAmountsText: content.donatePage.presetAmounts.join(', '),
  donateImpactRulesText: serializeImpactRules(content.donatePage.impactRules),
  donateDonorInfoTitle: content.donatePage.donorInfoTitle,
  donatePaymentTitle: content.donatePage.paymentTitle,
  donatePaymentNotice: content.donatePage.paymentNotice,
  donateSuccessTitle: content.donatePage.successTitle,
  donateSuccessDescription: content.donatePage.successDescription,
  donateSubmitLabel: content.donatePage.submitLabel,
  donateResetLabel: content.donatePage.resetLabel,
  campaignsSeoTitle: content.campaignsPage.seoTitle,
  campaignsSeoDescription: content.campaignsPage.seoDescription,
  campaignsHeroTitle: content.campaignsPage.heroTitle,
  campaignsHeroDescription: content.campaignsPage.heroDescription,
  campaignsDonateLabel: content.campaignsPage.donateLabel,
  newsSeoTitle: content.newsPage.seoTitle,
  newsSeoDescription: content.newsPage.seoDescription,
  newsHeroTitle: content.newsPage.heroTitle,
  newsHeroDescription: content.newsPage.heroDescription,
  newsReadMoreLabel: content.newsPage.readMoreLabel,
  settingsDefaultLanguage: content.settings.defaultLanguage,
  settingsSupportedLanguagesText: content.settings.supportedLanguages.join(', '),
})

const fromFormValues = (values: ContentFormValues): SiteContent => ({
  navbar: {
    siteName: values.navbarSiteName,
    logoUrl: values.navbarLogoUrl,
    donateLabel: values.navbarDonateLabel,
    donateLink: values.navbarDonateLink,
    links: parseSiteLinks(values.navbarLinksText),
  },
  footer: {
    brandTitle: values.footerBrandTitle,
    description: values.footerDescription,
    contact: {
      address: values.footerAddress,
      phone: values.footerPhone,
      email: values.footerEmail,
    },
    socialLinks: parseSocialLinks(values.footerSocialLinksText),
    quickLinks: parseSiteLinks(values.footerQuickLinksText),
    engagementLinks: parseSiteLinks(values.footerEngagementLinksText),
    legalLinks: parseSiteLinks(values.footerLegalLinksText),
    copyright: values.footerCopyright,
  },
  home: {
    seoTitle: values.homeSeoTitle,
    seoDescription: values.homeSeoDescription,
    hero: {
      titlePrefix: values.homeHeroTitlePrefix,
      titleHighlight: values.homeHeroTitleHighlight,
      description: values.homeHeroDescription,
      primaryButtonLabel: values.homeHeroPrimaryButtonLabel,
      primaryButtonLink: values.homeHeroPrimaryButtonLink,
      secondaryButtonLabel: values.homeHeroSecondaryButtonLabel,
      secondaryButtonLink: values.homeHeroSecondaryButtonLink,
      imageUrl: values.homeHeroImageUrl,
      imageAlt: values.homeHeroImageAlt,
    },
    stats: parseStats(values.homeStatsText),
    statsDisclaimer: values.homeStatsDisclaimer,
    programsSection: {
      title: values.homeProgramsTitle,
      description: values.homeProgramsDescription,
      items: parsePairs(values.homeProgramsItemsText),
    },
    campaignsSection: {
      title: values.homeCampaignsTitle,
      description: values.homeCampaignsDescription,
      allCampaignsLabel: values.homeAllCampaignsLabel,
      allCampaignsLink: values.homeAllCampaignsLink,
      donateLabel: values.homeCampaignsDonateLabel,
      donateLink: values.homeCampaignsDonateLink,
    },
    ctaSection: {
      title: values.homeCtaTitle,
      description: values.homeCtaDescription,
      buttonLabel: values.homeCtaButtonLabel,
      buttonLink: values.homeCtaButtonLink,
    },
    trustSection: {
      title: values.homeTrustTitle,
      description: values.homeTrustDescription,
      imageUrl: values.homeTrustImageUrl,
      imageAlt: values.homeTrustImageAlt,
      reportLabel: values.homeTrustReportLabel,
      reportLink: values.homeTrustReportLink,
      items: splitLines(values.homeTrustItemsText),
    },
  },
  about: {
    seoTitle: values.aboutSeoTitle,
    seoDescription: values.aboutSeoDescription,
    heroTitle: values.aboutHeroTitle,
    heroDescription: values.aboutHeroDescription,
    storyTitle: values.aboutStoryTitle,
    storyImageUrl: values.aboutStoryImageUrl,
    storyImageAlt: values.aboutStoryImageAlt,
    storyParagraphs: splitLines(values.aboutStoryParagraphsText),
    missionTitle: values.aboutMissionTitle,
    missionDescription: values.aboutMissionDescription,
    visionTitle: values.aboutVisionTitle,
    visionDescription: values.aboutVisionDescription,
    valuesTitle: values.aboutValuesTitle,
    valuesDescription: values.aboutValuesDescription,
    values: parsePairs(values.aboutValuesText),
    teamTitle: values.aboutTeamTitle,
    teamDescription: values.aboutTeamDescription,
    team: parseTeam(values.aboutTeamText),
  },
  programsPage: {
    seoTitle: values.programsSeoTitle,
    seoDescription: values.programsSeoDescription,
    heroTitle: values.programsHeroTitle,
    heroDescription: values.programsHeroDescription,
    programs: parsePrograms(values.programsItemsText),
    impactTitle: values.programsImpactTitle,
    impactParagraphs: splitLines(values.programsImpactParagraphsText),
    impactStats: parseStats(values.programsImpactStatsText),
  },
  contactPage: {
    seoTitle: values.contactSeoTitle,
    seoDescription: values.contactSeoDescription,
    heroTitle: values.contactHeroTitle,
    heroDescription: values.contactHeroDescription,
    infoTitle: values.contactInfoTitle,
    infoDescription: values.contactInfoDescription,
    formTitle: values.contactFormTitle,
    submitLabel: values.contactSubmitLabel,
    successMessage: values.contactSuccessMessage,
    addressLabel: values.contactAddressLabel,
    address: values.contactAddress,
    phoneLabel: values.contactPhoneLabel,
    phone: values.contactPhone,
    emailLabel: values.contactEmailLabel,
    email: values.contactEmail,
  },
  transparencyPage: {
    seoTitle: values.transparencySeoTitle,
    seoDescription: values.transparencySeoDescription,
    heroTitle: values.transparencyHeroTitle,
    heroDescription: values.transparencyHeroDescription,
    principlesTitle: values.transparencyPrinciplesTitle,
    principlesDescription: values.transparencyPrinciplesDescription,
    principles: parsePairs(values.transparencyPrinciplesText),
    allocationTitle: values.transparencyAllocationTitle,
    allocationDescription: values.transparencyAllocationDescription,
    allocationItems: parseAllocationItems(values.transparencyAllocationItemsText),
    reportsTitle: values.transparencyReportsTitle,
    reportsDescription: values.transparencyReportsDescription,
    reports: parseReports(values.transparencyReportsText),
    impactStats: parseStats(values.transparencyImpactStatsText),
    statsDisclaimer: values.transparencyStatsDisclaimer,
  },
  donatePage: {
    seoTitle: values.donateSeoTitle,
    seoDescription: values.donateSeoDescription,
    heroTitle: values.donateHeroTitle,
    heroDescription: values.donateHeroDescription,
    impactTitle: values.donateImpactTitle,
    oneTimeLabel: values.donateOneTimeLabel,
    monthlyLabel: values.donateMonthlyLabel,
    presetAmounts: values.donatePresetAmountsText
      .split(',')
      .map((item) => Number(item.trim()))
      .filter((item) => !Number.isNaN(item) && item > 0),
    impactRules: parseImpactRules(values.donateImpactRulesText),
    donorInfoTitle: values.donateDonorInfoTitle,
    paymentTitle: values.donatePaymentTitle,
    paymentNotice: values.donatePaymentNotice,
    successTitle: values.donateSuccessTitle,
    successDescription: values.donateSuccessDescription,
    submitLabel: values.donateSubmitLabel,
    resetLabel: values.donateResetLabel,
  },
  campaignsPage: {
    seoTitle: values.campaignsSeoTitle,
    seoDescription: values.campaignsSeoDescription,
    heroTitle: values.campaignsHeroTitle,
    heroDescription: values.campaignsHeroDescription,
    donateLabel: values.campaignsDonateLabel,
  },
  newsPage: {
    seoTitle: values.newsSeoTitle,
    seoDescription: values.newsSeoDescription,
    heroTitle: values.newsHeroTitle,
    heroDescription: values.newsHeroDescription,
    readMoreLabel: values.newsReadMoreLabel,
  },
  settings: {
    defaultLanguage: values.settingsDefaultLanguage,
    supportedLanguages: values.settingsSupportedLanguagesText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  },
})

const getErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return 'Impossible de sauvegarder le contenu.'
  }

  if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }

  return 'Impossible de sauvegarder le contenu.'
}

const SectionTitle = ({ title, description }: { title: string; description: string }) => (
  <div className="mb-5 min-w-0">
    <h2 className="break-words font-display text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h2>
    <p className="mt-1 break-words text-sm leading-6 text-slate-500">{description}</p>
  </div>
)

const TextAreaField = ({
  label,
  hint,
  rows = 4,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) => (
  <div className="w-full min-w-0 max-w-full space-y-2">
    <label className="block break-words text-sm font-medium text-slate-700">{label}</label>
    <textarea
      rows={rows}
      className="block w-full min-w-0 max-w-full resize-y overflow-x-auto break-words rounded-xl border border-slate-200 px-3 py-3 text-base text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 sm:px-4 sm:text-sm"
      {...props}
    />
    {hint ? <p className="min-w-0 break-words text-xs leading-5 text-slate-500">{hint}</p> : null}
  </div>
)

type UploadableImageField = 'homeHeroImageUrl' | 'homeTrustImageUrl' | 'aboutStoryImageUrl'
type TeamEditableField = 'name' | 'role' | 'imageUrl'

const createEmptyTeamMember = () => ({
  name: '',
  role: '',
  imageUrl: '',
})

const ImageUploadPanel = ({
  id,
  title,
  description,
  imageUrl,
  previewAlt,
  isUploading,
  isBusy,
  onUpload,
}: {
  id: string
  title: string
  description: string
  imageUrl: string
  previewAlt: string
  isUploading: boolean
  isBusy: boolean
  onUpload: (file: File) => Promise<void>
}) => {
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    event.target.value = ''

    if (!file || isBusy) {
      return
    }

    await onUpload(file)
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="rounded-2xl bg-orange-100 p-2 text-orange-600">
          <ImagePlus className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-semibold leading-5 text-slate-900">{title}</h3>
          <p className="mt-1 break-words text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>

      <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor={id}
          className={`inline-flex w-full min-w-0 max-w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-3 text-center text-sm font-semibold transition sm:w-auto sm:px-4 ${
            isBusy
              ? 'pointer-events-none bg-slate-200 text-slate-500'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          <span className="min-w-0 truncate sm:hidden">{isUploading ? 'Téléversement...' : 'Téléverser'}</span>
          <span className="hidden min-w-0 truncate sm:inline">
            {isUploading ? 'Téléversement...' : 'Téléverser une image'}
          </span>
        </label>
        <input
          id={id}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="sr-only"
          disabled={isBusy}
          onChange={(event) => {
            void handleFileChange(event)
          }}
        />
        <p className="min-w-0 break-words text-xs leading-5 text-slate-500">
          JPG, PNG, WEBP, GIF ou SVG, 5 Mo maximum.
        </p>
      </div>

      {imageUrl ? (
        <div className="mt-4 w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <img src={imageUrl} alt={previewAlt} className="block h-40 w-full max-w-full object-cover sm:h-52" />
          <div className="border-t border-slate-200 px-4 py-3">
            <p className="min-w-0 break-all text-xs leading-5 text-slate-500">{imageUrl}</p>
          </div>
        </div>
      ) : (
        <div className="mt-4 w-full min-w-0 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
          Aucune image sélectionnée pour le moment.
        </div>
      )}
    </div>
  )
}

const AdminContentPage = () => {
  const user = useAppSelector(selectCurrentUser)
  const canManageContent = hasContentAccess(user?.permissions)
  const { data, isLoading } = useGetAdminSiteContentQuery(undefined, {
    skip: !canManageContent,
  })
  const [updateSiteContent, { isLoading: isSaving }] = useUpdateSiteContentMutation()
  const [uploadSiteContentImage, { isLoading: isUploadingImage }] = useUploadSiteContentImageMutation()
  const [activeUploadKey, setActiveUploadKey] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, watch } = useForm<ContentFormValues>({
    defaultValues: toFormValues(defaultSiteContent),
  })

  const homeHeroImageUrl = watch('homeHeroImageUrl')
  const homeHeroImageAlt = watch('homeHeroImageAlt')
  const homeTrustImageUrl = watch('homeTrustImageUrl')
  const homeTrustImageAlt = watch('homeTrustImageAlt')
  const aboutStoryImageUrl = watch('aboutStoryImageUrl')
  const aboutStoryImageAlt = watch('aboutStoryImageAlt')
  const aboutTeamTextValue = watch('aboutTeamText')
  const teamMembers = parseTeam(aboutTeamTextValue)

  useEffect(() => {
    if (data?.content) {
      reset(toFormValues(data.content))
    }
  }, [data, reset])

  const saveTeamMembers = (items: Array<{ name: string; role: string; imageUrl: string }>) => {
    setValue('aboutTeamText', serializeTeam(items), { shouldDirty: true })
  }

  const handleUploadForField = async (
    field: UploadableImageField,
    folder: string,
    file: File,
    successLabel: string
  ) => {
    try {
      setActiveUploadKey(field)
      const response = await uploadSiteContentImage({ file, folder }).unwrap()
      setValue(field, response.url, { shouldDirty: true })
      toast.success(`${successLabel} téléversée avec succès.`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setActiveUploadKey(null)
    }
  }

  const handleTeamMemberChange = (index: number, field: TeamEditableField, value: string) => {
    const nextMembers = teamMembers.map((member, memberIndex) =>
      memberIndex === index ? { ...member, [field]: value } : member
    )

    saveTeamMembers(nextMembers)
  }

  const handleAddTeamMember = () => {
    saveTeamMembers([...teamMembers, createEmptyTeamMember()])
  }

  const handleRemoveTeamMember = (index: number) => {
    saveTeamMembers(teamMembers.filter((_, memberIndex) => memberIndex !== index))
  }

  const handleTeamImageUpload = async (index: number, file: File) => {
    try {
      setActiveUploadKey(`team-${index}`)
      const response = await uploadSiteContentImage({ file, folder: 'team' }).unwrap()
      const nextMembers = teamMembers.map((member, memberIndex) =>
        memberIndex === index ? { ...member, imageUrl: response.url } : member
      )
      saveTeamMembers(nextMembers)
      toast.success(`Photo du membre ${index + 1} téléversée avec succès.`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setActiveUploadKey(null)
    }
  }

  const onSubmit = async (values: ContentFormValues) => {
    try {
      const payload = fromFormValues(values)
      await updateSiteContent(payload).unwrap()
      toast.success('Le contenu du site a été mis à jour.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  if (!canManageContent) {
    return (
      <AdminShell
        title="Gestion du contenu"
        description="Modifiez les textes, sections et informations du site public depuis un seul écran."
      >
        <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-white p-4 shadow-panel sm:rounded-3xl sm:p-6">
          <p className="text-sm leading-6 text-slate-600">
            Votre compte ne dispose pas de la permission <code>content.manage</code>.
          </p>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Gestion du contenu"
      description="Cette section pilote le contenu global du site public. Les campagnes et actualités restent gérées dans leurs modules dédiés."
      actions={
        <Button
          type="submit"
          form="site-content-form"
          isLoading={isSaving || isLoading}
          className="w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          Enregistrer tout le contenu
        </Button>
      }
    >
      <form
        id="site-content-form"
        className="w-full min-w-0 max-w-full space-y-4 pb-24 sm:space-y-6 lg:pb-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-white p-4 shadow-panel sm:rounded-3xl sm:p-6">
          <div className="mb-4 inline-flex rounded-2xl bg-orange-100 p-3 text-orange-600">
            <FilePenLine className="h-6 w-6" />
          </div>
          <SectionTitle
            title="Header et footer"
            description="Modifiez le nom du site, les liens de navigation, le bouton de don et toutes les informations de bas de page."
          />
          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Nom du site" id="navbarSiteName" {...register('navbarSiteName')} />
            <Input label="URL du logo (optionnel)" id="navbarLogoUrl" {...register('navbarLogoUrl')} />
            <Input label="Texte bouton don" id="navbarDonateLabel" {...register('navbarDonateLabel')} />
            <Input label="Lien bouton don" id="navbarDonateLink" {...register('navbarDonateLink')} />
          </div>
          <div className="mt-4 min-w-0">
            <TextAreaField
              label="Liens du menu"
              rows={5}
              hint="Une ligne par lien : Label | /chemin"
              {...register('navbarLinksText')}
            />
          </div>
          <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Titre marque footer" id="footerBrandTitle" {...register('footerBrandTitle')} />
            <Input label="Copyright" id="footerCopyright" {...register('footerCopyright')} />
            <Input label="Adresse" id="footerAddress" {...register('footerAddress')} />
            <Input label="Téléphone" id="footerPhone" {...register('footerPhone')} />
            <Input label="Email" id="footerEmail" {...register('footerEmail')} />
          </div>
          <div className="mt-4 min-w-0">
            <TextAreaField
              label="Description footer"
              rows={3}
              {...register('footerDescription')}
            />
          </div>
          <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            <TextAreaField
              label="Réseaux sociaux"
              rows={4}
              hint="Une ligne : Label | https://..."
              {...register('footerSocialLinksText')}
            />
            <TextAreaField
              label="Liens rapides"
              rows={4}
              hint="Une ligne : Label | /chemin"
              {...register('footerQuickLinksText')}
            />
            <TextAreaField
              label="Liens s'impliquer"
              rows={4}
              hint="Une ligne : Label | /chemin"
              {...register('footerEngagementLinksText')}
            />
            <TextAreaField
              label="Liens légaux"
              rows={4}
              hint="Une ligne : Label | /chemin"
              {...register('footerLegalLinksText')}
            />
          </div>
        </section>

        <section className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-white p-4 shadow-panel sm:rounded-3xl sm:p-6">
          <SectionTitle
            title="Accueil"
            description="Modifiez le hero, les statistiques, l'introduction des programmes, le CTA et la zone de confiance."
          />
          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="SEO titre" id="homeSeoTitle" {...register('homeSeoTitle')} />
            <Input label="SEO description" id="homeSeoDescription" {...register('homeSeoDescription')} />
            <Input label="Titre hero avant mise en évidence" id="homeHeroTitlePrefix" {...register('homeHeroTitlePrefix')} />
            <Input label="Texte hero mis en évidence" id="homeHeroTitleHighlight" {...register('homeHeroTitleHighlight')} />
            <Input label="Bouton principal" id="homeHeroPrimaryButtonLabel" {...register('homeHeroPrimaryButtonLabel')} />
            <Input label="Lien bouton principal" id="homeHeroPrimaryButtonLink" {...register('homeHeroPrimaryButtonLink')} />
            <Input label="Bouton secondaire" id="homeHeroSecondaryButtonLabel" {...register('homeHeroSecondaryButtonLabel')} />
            <Input label="Lien bouton secondaire" id="homeHeroSecondaryButtonLink" {...register('homeHeroSecondaryButtonLink')} />
            <Input label="URL image hero" id="homeHeroImageUrl" {...register('homeHeroImageUrl')} />
            <Input label="Alt image hero" id="homeHeroImageAlt" {...register('homeHeroImageAlt')} />
          </div>
          <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
            <ImageUploadPanel
              id="home-hero-upload"
              title="Téléverser l'image hero"
              description="Choisissez une image depuis votre ordinateur. L'URL sera remplie automatiquement."
              imageUrl={homeHeroImageUrl}
              previewAlt={homeHeroImageAlt || 'Image hero'}
              isUploading={isUploadingImage && activeUploadKey === 'homeHeroImageUrl'}
              isBusy={isUploadingImage}
              onUpload={(file) =>
                handleUploadForField('homeHeroImageUrl', 'home-hero', file, "L'image hero")
              }
            />
            <ImageUploadPanel
              id="home-trust-upload"
              title="Téléverser l'image section confiance"
              description="Cette image apparaît dans la section de confiance de la page d'accueil."
              imageUrl={homeTrustImageUrl}
              previewAlt={homeTrustImageAlt || 'Image section confiance'}
              isUploading={isUploadingImage && activeUploadKey === 'homeTrustImageUrl'}
              isBusy={isUploadingImage}
              onUpload={(file) =>
                handleUploadForField('homeTrustImageUrl', 'home-trust', file, "L'image de confiance")
              }
            />
          </div>
          <div className="mt-4 min-w-0">
            <TextAreaField label="Description hero" rows={3} {...register('homeHeroDescription')} />
          </div>
          <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            <TextAreaField
              label="Statistiques"
              rows={4}
              hint="Une ligne : valeur | libellé"
              {...register('homeStatsText')}
            />
            <TextAreaField
              label="Programmes accueil"
              rows={5}
              hint="Une ligne : titre | description"
              {...register('homeProgramsItemsText')}
            />
          </div>
          <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Titre section programmes" id="homeProgramsTitle" {...register('homeProgramsTitle')} />
            <Input label="Description section programmes" id="homeProgramsDescription" {...register('homeProgramsDescription')} />
            <Input label="Titre section campagnes" id="homeCampaignsTitle" {...register('homeCampaignsTitle')} />
            <Input label="Description section campagnes" id="homeCampaignsDescription" {...register('homeCampaignsDescription')} />
            <Input label="Texte lien toutes campagnes" id="homeAllCampaignsLabel" {...register('homeAllCampaignsLabel')} />
            <Input label="Lien toutes campagnes" id="homeAllCampaignsLink" {...register('homeAllCampaignsLink')} />
            <Input label="Texte bouton don cartes campagnes" id="homeCampaignsDonateLabel" {...register('homeCampaignsDonateLabel')} />
            <Input label="Lien bouton don cartes campagnes" id="homeCampaignsDonateLink" {...register('homeCampaignsDonateLink')} />
            <Input label="Titre CTA" id="homeCtaTitle" {...register('homeCtaTitle')} />
            <Input label="Description CTA" id="homeCtaDescription" {...register('homeCtaDescription')} />
            <Input label="Texte bouton CTA" id="homeCtaButtonLabel" {...register('homeCtaButtonLabel')} />
            <Input label="Lien bouton CTA" id="homeCtaButtonLink" {...register('homeCtaButtonLink')} />
            <Input label="Titre section confiance" id="homeTrustTitle" {...register('homeTrustTitle')} />
            <Input label="Description section confiance" id="homeTrustDescription" {...register('homeTrustDescription')} />
            <Input label="URL image section confiance" id="homeTrustImageUrl" {...register('homeTrustImageUrl')} />
            <Input label="Alt image confiance" id="homeTrustImageAlt" {...register('homeTrustImageAlt')} />
            <Input label="Texte lien rapports" id="homeTrustReportLabel" {...register('homeTrustReportLabel')} />
            <Input label="Lien rapports" id="homeTrustReportLink" {...register('homeTrustReportLink')} />
            <Input label="Texte de secours statistiques" id="homeStatsDisclaimer" {...register('homeStatsDisclaimer')} />
          </div>
          <div className="mt-4 min-w-0">
            <TextAreaField
              label="Arguments de confiance"
              rows={5}
              hint="Une ligne par point"
              {...register('homeTrustItemsText')}
            />
          </div>
        </section>

        <section className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-white p-4 shadow-panel sm:rounded-3xl sm:p-6">
          <SectionTitle
            title="À propos et équipe"
            description="C'est ici que l'administrateur modifie les textes de la rubrique Notre équipe, l'histoire, la mission, la vision et les valeurs."
          />
          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="SEO titre" id="aboutSeoTitle" {...register('aboutSeoTitle')} />
            <Input label="SEO description" id="aboutSeoDescription" {...register('aboutSeoDescription')} />
            <Input label="Titre hero" id="aboutHeroTitle" {...register('aboutHeroTitle')} />
            <Input label="Description hero" id="aboutHeroDescription" {...register('aboutHeroDescription')} />
            <Input label="Titre histoire" id="aboutStoryTitle" {...register('aboutStoryTitle')} />
            <Input label="URL image histoire" id="aboutStoryImageUrl" {...register('aboutStoryImageUrl')} />
            <Input label="Alt image histoire" id="aboutStoryImageAlt" {...register('aboutStoryImageAlt')} />
            <Input label="Titre mission" id="aboutMissionTitle" {...register('aboutMissionTitle')} />
            <Input label="Description mission" id="aboutMissionDescription" {...register('aboutMissionDescription')} />
            <Input label="Titre vision" id="aboutVisionTitle" {...register('aboutVisionTitle')} />
            <Input label="Description vision" id="aboutVisionDescription" {...register('aboutVisionDescription')} />
            <Input label="Titre valeurs" id="aboutValuesTitle" {...register('aboutValuesTitle')} />
            <Input label="Description valeurs" id="aboutValuesDescription" {...register('aboutValuesDescription')} />
            <Input label="Titre équipe" id="aboutTeamTitle" {...register('aboutTeamTitle')} />
            <Input label="Description équipe" id="aboutTeamDescription" {...register('aboutTeamDescription')} />
          </div>
          <div className="mt-4 min-w-0">
            <ImageUploadPanel
              id="about-story-upload"
              title="Téléverser l'image de l'histoire"
              description="Cette image est affichée dans la section histoire de la page À propos."
              imageUrl={aboutStoryImageUrl}
              previewAlt={aboutStoryImageAlt || "Image de l'histoire"}
              isUploading={isUploadingImage && activeUploadKey === 'aboutStoryImageUrl'}
              isBusy={isUploadingImage}
              onUpload={(file) =>
                handleUploadForField('aboutStoryImageUrl', 'about-story', file, "L'image de l'histoire")
              }
            />
          </div>
          <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            <TextAreaField
              label="Paragraphes histoire"
              rows={6}
              hint="Une ligne = un paragraphe"
              {...register('aboutStoryParagraphsText')}
            />
            <TextAreaField
              label="Valeurs"
              rows={6}
              hint="Une ligne : titre | description"
              {...register('aboutValuesText')}
            />
          </div>
          <input type="hidden" {...register('aboutTeamText')} />
          <div className="mt-6 min-w-0 space-y-4">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-slate-900">Membres de l'équipe</h3>
                <p className="mt-1 break-words text-sm text-slate-500">
                  Ajoutez les membres un par un et téléversez leur photo directement ici.
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={handleAddTeamMember} className="w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Ajouter un membre
              </Button>
            </div>

            {teamMembers.length === 0 ? (
              <div className="w-full min-w-0 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                Aucun membre n'est encore configuré. Cliquez sur "Ajouter un membre" pour commencer.
              </div>
            ) : null}

            {teamMembers.map((member, index) => (
              <div
                key={`${member.name}-${index}`}
                className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4"
              >
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900">Membre {index + 1}</h4>
                    <p className="mt-1 break-words text-xs text-slate-500">
                      Renseignez le nom, le rôle et la photo de cette personne.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto"
                    onClick={() => handleRemoveTeamMember(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                </div>

                <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
                  <Input
                    label="Nom"
                    id={`team-name-${index}`}
                    value={member.name}
                    onChange={(event) => handleTeamMemberChange(index, 'name', event.target.value)}
                  />
                  <Input
                    label="Rôle"
                    id={`team-role-${index}`}
                    value={member.role}
                    onChange={(event) => handleTeamMemberChange(index, 'role', event.target.value)}
                  />
                  <Input
                    label="URL de la photo"
                    id={`team-image-${index}`}
                    value={member.imageUrl}
                    onChange={(event) => handleTeamMemberChange(index, 'imageUrl', event.target.value)}
                  />
                </div>

                <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
                  <ImageUploadPanel
                    id={`team-upload-${index}`}
                    title={`Téléverser la photo du membre ${index + 1}`}
                    description="Après l'envoi, le champ URL est rempli automatiquement."
                    imageUrl={member.imageUrl}
                    previewAlt={member.name || `Photo du membre ${index + 1}`}
                    isUploading={isUploadingImage && activeUploadKey === `team-${index}`}
                    isBusy={isUploadingImage}
                    onUpload={(file) => handleTeamImageUpload(index, file)}
                  />
                  <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name || `Photo du membre ${index + 1}`}
                        className="block h-48 w-full max-w-full object-cover sm:h-56 xl:h-full xl:min-h-[220px]"
                      />
                    ) : (
                      <div className="flex h-48 w-full items-center justify-center px-4 text-center text-sm text-slate-500 sm:h-56 xl:h-full xl:min-h-[220px]">
                        L'aperçu de la photo apparaîtra ici.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <details className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-medium text-slate-700">
                Mode avancé : modifier la liste brute
              </summary>
              <div className="mt-4 min-w-0">
                <TextAreaField
                  label="Notre équipe"
                  rows={6}
                  hint="Une ligne : nom | rôle | imageUrl"
                  value={aboutTeamTextValue}
                  onChange={(event) =>
                    setValue('aboutTeamText', event.target.value, { shouldDirty: true })
                  }
                />
              </div>
            </details>
          </div>
        </section>

        <section className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-white p-4 shadow-panel sm:rounded-3xl sm:p-6">
          <SectionTitle
            title="Programmes, contact et transparence"
            description="Gérez les pages d'information du site public."
          />
          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="SEO programmes" id="programsSeoTitle" {...register('programsSeoTitle')} />
            <Input label="Description SEO programmes" id="programsSeoDescription" {...register('programsSeoDescription')} />
            <Input label="Titre hero programmes" id="programsHeroTitle" {...register('programsHeroTitle')} />
            <Input label="Description hero programmes" id="programsHeroDescription" {...register('programsHeroDescription')} />
            <Input label="Titre impact programmes" id="programsImpactTitle" {...register('programsImpactTitle')} />
          </div>
          <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            <TextAreaField
              label="Liste des programmes"
              rows={8}
              hint="Une ligne : titre | description | feature1, feature2, feature3"
              {...register('programsItemsText')}
            />
            <TextAreaField
              label="Paragraphes impact programmes"
              rows={5}
              hint="Une ligne = un paragraphe"
              {...register('programsImpactParagraphsText')}
            />
            <TextAreaField
              label="Statistiques impact programmes"
              rows={4}
              hint="Une ligne : valeur | libellé"
              {...register('programsImpactStatsText')}
            />
            <TextAreaField
              label="Principes de transparence"
              rows={6}
              hint="Une ligne : titre | description"
              {...register('transparencyPrinciplesText')}
            />
            <TextAreaField
              label="Allocation des dons"
              rows={4}
              hint="Une ligne : nom | valeur | couleurHex"
              {...register('transparencyAllocationItemsText')}
            />
            <TextAreaField
              label="Rapports"
              rows={4}
              hint="Une ligne : année | titre | lien | statut"
              {...register('transparencyReportsText')}
            />
          </div>
          <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="SEO contact" id="contactSeoTitle" {...register('contactSeoTitle')} />
            <Input label="Description SEO contact" id="contactSeoDescription" {...register('contactSeoDescription')} />
            <Input label="Titre hero contact" id="contactHeroTitle" {...register('contactHeroTitle')} />
            <Input label="Description hero contact" id="contactHeroDescription" {...register('contactHeroDescription')} />
            <Input label="Titre bloc contact" id="contactInfoTitle" {...register('contactInfoTitle')} />
            <Input label="Description bloc contact" id="contactInfoDescription" {...register('contactInfoDescription')} />
            <Input label="Titre formulaire contact" id="contactFormTitle" {...register('contactFormTitle')} />
            <Input label="Texte bouton formulaire" id="contactSubmitLabel" {...register('contactSubmitLabel')} />
            <Input label="Message succès formulaire" id="contactSuccessMessage" {...register('contactSuccessMessage')} />
            <Input label="Label adresse" id="contactAddressLabel" {...register('contactAddressLabel')} />
            <Input label="Adresse" id="contactAddress" {...register('contactAddress')} />
            <Input label="Label téléphone" id="contactPhoneLabel" {...register('contactPhoneLabel')} />
            <Input label="Téléphone" id="contactPhone" {...register('contactPhone')} />
            <Input label="Label email" id="contactEmailLabel" {...register('contactEmailLabel')} />
            <Input label="Email" id="contactEmail" {...register('contactEmail')} />
            <Input label="SEO transparence" id="transparencySeoTitle" {...register('transparencySeoTitle')} />
            <Input label="Description SEO transparence" id="transparencySeoDescription" {...register('transparencySeoDescription')} />
            <Input label="Titre hero transparence" id="transparencyHeroTitle" {...register('transparencyHeroTitle')} />
            <Input label="Description hero transparence" id="transparencyHeroDescription" {...register('transparencyHeroDescription')} />
            <Input label="Titre principes" id="transparencyPrinciplesTitle" {...register('transparencyPrinciplesTitle')} />
            <Input label="Description principes" id="transparencyPrinciplesDescription" {...register('transparencyPrinciplesDescription')} />
            <Input label="Titre allocation" id="transparencyAllocationTitle" {...register('transparencyAllocationTitle')} />
            <Input label="Description allocation" id="transparencyAllocationDescription" {...register('transparencyAllocationDescription')} />
            <Input label="Titre rapports" id="transparencyReportsTitle" {...register('transparencyReportsTitle')} />
            <Input label="Description rapports" id="transparencyReportsDescription" {...register('transparencyReportsDescription')} />
            <Input label="Texte secours stats transparence" id="transparencyStatsDisclaimer" {...register('transparencyStatsDisclaimer')} />
          </div>
          <div className="mt-4 min-w-0">
            <TextAreaField
              label="Statistiques transparence"
              rows={4}
              hint="Une ligne : valeur | libellé"
              {...register('transparencyImpactStatsText')}
            />
          </div>
        </section>

        <section className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-white p-4 shadow-panel sm:rounded-3xl sm:p-6">
          <SectionTitle
            title="Dons, campagnes, actualités et paramètres"
            description="Réglez les libellés de la page de don, les héro de campagnes/actualités et les paramètres généraux du site."
          />
          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="SEO dons" id="donateSeoTitle" {...register('donateSeoTitle')} />
            <Input label="Description SEO dons" id="donateSeoDescription" {...register('donateSeoDescription')} />
            <Input label="Titre hero dons" id="donateHeroTitle" {...register('donateHeroTitle')} />
            <Input label="Description hero dons" id="donateHeroDescription" {...register('donateHeroDescription')} />
            <Input label="Titre impact dons" id="donateImpactTitle" {...register('donateImpactTitle')} />
            <Input label="Texte option don unique" id="donateOneTimeLabel" {...register('donateOneTimeLabel')} />
            <Input label="Texte option mensuel" id="donateMonthlyLabel" {...register('donateMonthlyLabel')} />
            <Input label="Titre informations donateur" id="donateDonorInfoTitle" {...register('donateDonorInfoTitle')} />
            <Input label="Titre paiement" id="donatePaymentTitle" {...register('donatePaymentTitle')} />
            <Input label="Message paiement" id="donatePaymentNotice" {...register('donatePaymentNotice')} />
            <Input label="Titre succès don" id="donateSuccessTitle" {...register('donateSuccessTitle')} />
            <Input label="Description succès don" id="donateSuccessDescription" {...register('donateSuccessDescription')} />
            <Input label="Texte bouton don" id="donateSubmitLabel" {...register('donateSubmitLabel')} />
            <Input label="Texte bouton recommencer" id="donateResetLabel" {...register('donateResetLabel')} />
            <Input label="SEO campagnes" id="campaignsSeoTitle" {...register('campaignsSeoTitle')} />
            <Input label="Description SEO campagnes" id="campaignsSeoDescription" {...register('campaignsSeoDescription')} />
            <Input label="Titre hero campagnes" id="campaignsHeroTitle" {...register('campaignsHeroTitle')} />
            <Input label="Description hero campagnes" id="campaignsHeroDescription" {...register('campaignsHeroDescription')} />
            <Input label="Texte bouton campagnes" id="campaignsDonateLabel" {...register('campaignsDonateLabel')} />
            <Input label="SEO actualités" id="newsSeoTitle" {...register('newsSeoTitle')} />
            <Input label="Description SEO actualités" id="newsSeoDescription" {...register('newsSeoDescription')} />
            <Input label="Titre hero actualités" id="newsHeroTitle" {...register('newsHeroTitle')} />
            <Input label="Description hero actualités" id="newsHeroDescription" {...register('newsHeroDescription')} />
            <Input label="Texte lire la suite" id="newsReadMoreLabel" {...register('newsReadMoreLabel')} />
            <Input label="Langue par défaut" id="settingsDefaultLanguage" {...register('settingsDefaultLanguage')} />
            <Input label="Langues supportées" id="settingsSupportedLanguagesText" {...register('settingsSupportedLanguagesText')} />
          </div>
          <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            <TextAreaField
              label="Montants prédéfinis"
              rows={2}
              hint="Séparez les montants par des virgules : 25, 50, 100"
              {...register('donatePresetAmountsText')}
            />
            <TextAreaField
              label="Règles d'impact du don"
              rows={5}
              hint="Une ligne : seuil | libellé"
              {...register('donateImpactRulesText')}
            />
          </div>
        </section>
      </form>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <Button type="submit" form="site-content-form" fullWidth isLoading={isSaving || isLoading}>
          <Save className="h-4 w-4" />
          Enregistrer tout le contenu
        </Button>
      </div>
    </AdminShell>
  )
}

export default AdminContentPage
