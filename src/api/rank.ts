import request from '@/utils/request.ts'

// 获取活动信息
export const getRankList = data => {
  return request.post('/api/ebuilder/form/formdata/v2/getFormDataList/shsj_hhbd', data)
}
