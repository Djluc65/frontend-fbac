export type CampaignStatus = 'active' | 'completed' | 'paused'
export type CampaignCategory =
  | 'education'
  | 'food'
  | 'clothing'
  | 'health'
  | 'community'
  | 'other'

export interface Campaign {
  _id: string
  title: string
  description: string
  goalAmount: number
  raisedAmount: number
  image: string
  startDate: string
  endDate: string
  status: CampaignStatus
  category: CampaignCategory
  createdAt: string
  updatedAt: string
}

export interface CampaignPayload {
  title: string
  description: string
  goalAmount: number
  raisedAmount: number
  image: string
  startDate: string
  endDate: string
  status: CampaignStatus
  category: CampaignCategory
}
