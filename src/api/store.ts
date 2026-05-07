import request from '@/utils/request.ts'

// 获取商家信息
export const getStoreInfo = data => {
  return request.post('/v2/getFormDataList/shsj_sjxx', data)
}
// 获取商家得分
export const getScoreInfo = data => {
  return request.post('/v2/getFormDataList/shsj_sjdf', data)
}
