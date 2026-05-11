import request from '@/utils/request.ts'

export const getMessage = data => {
  return request.post('/api/ebuilder/form/formdata/v2/getFormDataList/shsj_zxzx', data)
}
