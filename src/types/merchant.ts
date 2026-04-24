// 商家状态枚举
export enum MerchantStatus {
  Normal = 'normal',     // 正常经营
  Reform = 'reform',     // 整改中
  HighRisk = 'highRisk', // 高风险
}

// 商家状态标签配置
export const MerchantStatusConfig = {
  [MerchantStatus.Normal]: {
    label: '正常经营',
    color: '#4CAF50',
    bgColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  [MerchantStatus.Reform]: {
    label: '整改中',
    color: '#FF9800',
    bgColor: '#FFF3E0',
    borderColor: '#FF9800',
  },
  [MerchantStatus.HighRisk]: {
    label: '高风险',
    color: '#F44336',
    bgColor: '#FFEBEE',
    borderColor: '#F44336',
  },
}

// 商家标签
export interface MerchantTag {
  id: string
  name: string
  type?: 'brand' | 'area' | 'special' | 'default'
}

// 商家信息
export interface Merchant {
  id: string
  name: string
  image: string
  rating: number       // 评分（满分100）
  distance: string     // 距离
  category: string     // 分类
  area: string         // 区域
  years: number        // 店龄（年）
  tags: MerchantTag[]
  status: MerchantStatus
  complaints: number   // 年度投诉数
  cases: number        // 立案查处数
  isBenchmark?: boolean // 是否标杆单位
}

// 商家星级统计
export interface StarRating {
  star: number   // 星级（1-5）
  percent: number
  count: number
}

// 商家统计信息
export interface MerchantStats {
  platform: number     // 平台内商家
  delivery: number     // 外卖商家
  noDelivery: number   // 无堂食外卖商家
}

// 监管信息
export interface SupervisionInfo {
  year: number
  inspectionCount: number
  inspectionBatch: number
  qualifiedRate: string
  complaintCount: number
}

// 资讯
export interface NewsItem {
  id: string
  title: string
  date: string
  url?: string
}

// 热门服务
export interface HotService {
  id: string
  title: string
  subtitle: string
  icon: string
  route: string
  color: string
}

// 搜索参数
export interface SearchParams {
  keyword: string
  status?: MerchantStatus | 'all'
  page: number
  pageSize: number
}

// 分页响应
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
