export interface SiteLink {
  label: string
  path: string
}

export interface SocialLink {
  label: string
  href: string
}

export interface SiteStat {
  value: string
  label: string
}

export interface TextItem {
  title: string
  description: string
}

export interface TeamMember {
  name: string
  role: string
  imageUrl: string
}

export interface ProgramItem {
  title: string
  description: string
  features: string[]
}

export interface AllocationItem {
  name: string
  value: number
  color: string
}

export interface ReportItem {
  year: number
  title: string
  download: string
  status: string
}

export interface DonateImpactRule {
  threshold: number
  label: string
}

export interface SiteContent {
  navbar: {
    siteName: string
    logoUrl: string
    donateLabel: string
    donateLink: string
    links: SiteLink[]
  }
  footer: {
    brandTitle: string
    description: string
    contact: {
      address: string
      phone: string
      email: string
    }
    socialLinks: SocialLink[]
    quickLinks: SiteLink[]
    engagementLinks: SiteLink[]
    legalLinks: SiteLink[]
    copyright: string
  }
  home: {
    seoTitle: string
    seoDescription: string
    hero: {
      titlePrefix: string
      titleHighlight: string
      description: string
      primaryButtonLabel: string
      primaryButtonLink: string
      secondaryButtonLabel: string
      secondaryButtonLink: string
      imageUrl: string
      imageAlt: string
    }
    stats: SiteStat[]
    statsDisclaimer: string
    programsSection: {
      title: string
      description: string
      items: TextItem[]
    }
    campaignsSection: {
      title: string
      description: string
      allCampaignsLabel: string
      allCampaignsLink: string
      donateLabel: string
      donateLink: string
    }
    ctaSection: {
      title: string
      description: string
      buttonLabel: string
      buttonLink: string
    }
    trustSection: {
      title: string
      description: string
      imageUrl: string
      imageAlt: string
      reportLabel: string
      reportLink: string
      items: string[]
    }
  }
  about: {
    seoTitle: string
    seoDescription: string
    heroTitle: string
    heroDescription: string
    storyTitle: string
    storyImageUrl: string
    storyImageAlt: string
    storyParagraphs: string[]
    missionTitle: string
    missionDescription: string
    visionTitle: string
    visionDescription: string
    valuesTitle: string
    valuesDescription: string
    values: TextItem[]
    teamTitle: string
    teamDescription: string
    team: TeamMember[]
  }
  programsPage: {
    seoTitle: string
    seoDescription: string
    heroTitle: string
    heroDescription: string
    programs: ProgramItem[]
    impactTitle: string
    impactParagraphs: string[]
    impactStats: SiteStat[]
  }
  contactPage: {
    seoTitle: string
    seoDescription: string
    heroTitle: string
    heroDescription: string
    infoTitle: string
    infoDescription: string
    formTitle: string
    submitLabel: string
    successMessage: string
    addressLabel: string
    address: string
    phoneLabel: string
    phone: string
    emailLabel: string
    email: string
  }
  transparencyPage: {
    seoTitle: string
    seoDescription: string
    heroTitle: string
    heroDescription: string
    principlesTitle: string
    principlesDescription: string
    principles: TextItem[]
    allocationTitle: string
    allocationDescription: string
    allocationItems: AllocationItem[]
    reportsTitle: string
    reportsDescription: string
    reports: ReportItem[]
    impactStats: SiteStat[]
    statsDisclaimer: string
  }
  donatePage: {
    seoTitle: string
    seoDescription: string
    heroTitle: string
    heroDescription: string
    impactTitle: string
    oneTimeLabel: string
    monthlyLabel: string
    presetAmounts: number[]
    impactRules: DonateImpactRule[]
    donorInfoTitle: string
    paymentNotice: string
    paymentTitle: string
    successTitle: string
    successDescription: string
    submitLabel: string
    resetLabel: string
  }
  campaignsPage: {
    seoTitle: string
    seoDescription: string
    heroTitle: string
    heroDescription: string
    donateLabel: string
  }
  newsPage: {
    seoTitle: string
    seoDescription: string
    heroTitle: string
    heroDescription: string
    readMoreLabel: string
  }
  settings: {
    defaultLanguage: string
    supportedLanguages: string[]
  }
}

export interface AdminSiteContentResponse {
  _id: string
  key: string
  content: SiteContent
  updatedBy?: string | null
  updatedAt?: string
}
