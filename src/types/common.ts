// 通用响应格式
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  success: boolean
}

// 分页参数
export interface PaginationParams {
  page: number
  pageSize: number
}

// 列表状态
export type LoadStatus = 'loading' | 'nomore' | 'more'

// 路由参数
export interface RouteQuery {
  [key: string]: string | number | undefined
}

// uni.request 选项
export interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: Record<string, unknown>
  header?: Record<string, string>
  timeout?: number
}
