import request from '@/utils/request.ts'

// 获取活动信息
export const getCheckList = data => {
  return request.post('/v2/getFormDataList/shsj_hdxx', data)
}

// 提交活动评论
export const addComment = data => {
  return request.post('/v2/saveFormData/shsj_hdpl', data)
}
