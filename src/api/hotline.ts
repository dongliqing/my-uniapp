import request from '@/utils/request.ts'

// 获取资讯信息
export const getMessageInfo = data => {
  return request.post('/api/ebuilder/form/formdata/v2/getFormDataList/shsj_zxxx', data)
}
