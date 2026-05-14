import request from '@/utils/request.ts'
import request2 from '@/utils/request-2'

// 获取活动信息
export const getCheckList = data => {
  return request.post('/api/ebuilder/form/formdata/v2/getFormDataList/shsj_hdxx', data)
}

// 获取详情
export const getCheckDetail = data => {
  return request.post('/api/ebuilder/form/formdata/v2/getFormDataByPk/shsj_hdxxsjxq', data)
}

// 提交活动评论点赞
export const addComment = data => {
  return request.post('/api/ebuilder/form/formdata/v2/updateFormData/shsj_hdpl', data)
}

// 提交活动评论点赞
export const addLike = data => {
  return request.post('/api/ebuilder/form/formdata/v2/saveFormData/shsj_pldz', data)
}

// 点赞
export const removelike = data => {
  return request.post('/api/ebuilder/form/formdata/v2/deleteFormData/shsj_hdqxdz', data)
}

// 获取详情
export const getCheckLikes = data => {
  return request2.post('/api/dw/publish/shsj_hdsjxq', data)
}
