import request from '@/utils/request.ts'

// 获取活动信息
export const getCheckList = data => {
  return request.post('/v2/getFormDataList/shsj_zxxx', data)
}
