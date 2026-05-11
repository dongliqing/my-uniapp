import request from '@/utils/request.ts'

// 获取活动信息
export const getCheckList = data => {
  return request.post('/api/ebuilder/form/formdata/v2/getFormDataList/shsj_hdxx', data)
}

// 获取详情
export const getCheckDetail = data => {
  return request.post('/v2/getFormDataByPk/shsj_hdxxsjxq', data)
}

// 提交活动评论
export const addComment = data => {
  return request.post('/api/ebuilder/form/formdata/v2/saveFormData/shsj_hdpl', data)
}
