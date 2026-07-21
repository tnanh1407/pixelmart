export interface ICampaignSubsection {
  title?: string
  content?: string
}

export interface ICampaign {
  _id: string
  title: string
  slug: string
  type: "promotion" | "blog"
  shortDescription?: string
  content?: string
  image: string
  isActive: boolean
  startDate?: string
  endDate?: string
  order: number
  durationInDays?: number
  createdAt: string
  updatedAt: string
  authorId?: string | { _id: string; name: string; avatar?: string }
  sapo?: string
  contentSections?: ICampaignSubsection[]
  highlightsTitle?: string
  highlights?: string[]
  quote?: string
  quoteAuthor?: string
}
