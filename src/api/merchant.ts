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
    ...res[0]?.datas[1].mainTable, // 商家信息
    dishes: res[0]?.datas[1].detail2 ?? [], // 商家菜品
    honors: res[0]?.datas[1].detail1 ?? [], // 商家荣誉
    comments: res[0]?.datas[0].detail3 ?? [], // 商家评论
    penalty: res[1]?.datas, // 年度处罚
    score: res[2]?.datas[0].mainTable, // 得分信息
    complaint: res[3]?.datas // 投诉信息
  }))
}

// 提投诉
export const addComplaint = (data: Record<string, any>) => {
  return request.post(`${BASE_URL_SET}shsj_sjts`, data)
}

// 提评价
export const addComment = (data: Record<string, any>) => {
  return request.post(`${BASE_URL_SET}shsj_sjpj`, data)
}
