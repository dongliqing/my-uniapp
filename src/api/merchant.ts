import request from '@/utils/request'

const BASE_URL_GET = '/v2/getFormDataList/'
const BASE_URL_SET = '/v2/saveFormData/'

/** 商家详情 - 整合年度处罚、商家得分、投诉信息 */
export const getMerchantInfo = (data: Record<string, any>) => {
  return Promise.all([
    request.post(`${BASE_URL_GET}shsj_sjxx`, data),
    request.post(`${BASE_URL_GET}shsj_ndcf`, data),
    request.post(`${BASE_URL_GET}shsj_sjdf`, data),
    request.post(`${BASE_URL_GET}shsj_tsxx`, data)
  ]).then((res: any[]) => ({
    info: res[0]?.data,
    penalty: res[1]?.data,
    score: res[2]?.data,
    complaint: res[3]?.data
  }))
}

// 提投诉
export const addComplaint = (data: Record<string, any>) => {
  console.log('----', data)

  return request.post(`${BASE_URL_SET}shsj_sjts`, data)
}

// 提评价
export const addComment = (data: Record<string, any>) => {
  return request.post(`${BASE_URL_SET}shsj_sjpj`, data)
}
