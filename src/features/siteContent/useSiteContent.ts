import { defaultSiteContent } from './defaultSiteContent'
import { useGetPublicSiteContentQuery } from './siteContentApi'

export const useSiteContent = () => {
  const query = useGetPublicSiteContentQuery()

  return {
    ...query,
    content: query.data ?? defaultSiteContent,
    isUsingFallback: !query.data,
  }
}
