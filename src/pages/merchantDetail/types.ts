export interface DishItem {
  cm: string
  jg: string
  tp: string
}

export interface CommentItem {
  id: number | string
  avatar: string
  nickname: string
  xj: number
  pj: string
  tp?: string[]
  pjrq: string
}

export interface MerchantDetail {
  id: number | string
  sjxx: string // 商家名称
  heroImage: string
  sjxj: number // 商家星级
  status: 'normal' | 'rectify' | 'high'
  category: string
  area: string
  year: number
  badges: string[]
  yysjkm: string // 营业时间（开门）
  yysjgm: string // 营业时间（关门）
  kysj: string // 开业时间
  address: string
  honors: string[]
  score: any
  comments: CommentItem[]
  dishes: DishItem[]
}

// 得分
export interface ScoreDimension {
  key: string
  name: string
  score: number
}
