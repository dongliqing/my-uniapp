import request from '@/utils/request'
import request2 from '@/utils/request-2.ts'

const BASE_URL_GET = '/api/ebuilder/form/formdata/v2/getFormDataByPk/'
const BASE_URL_SET = '/api/ebuilder/form/formdata/v2/saveFormData/'

/** 商家详情 - 整合年度处罚、商家得分、投诉信息 */
export const getMerchantInfo = (id: string) => {
  return Promise.all([
    request.post(`${BASE_URL_GET}shsj_sjxxsjxq`, { mainTable: { id } }),
    request2.post('/api/dw/publish/shsj_jsxx', { param: { id }, pageNo: 1, pageSize: 999 }),
    request.post(`${BASE_URL_GET}shsj_sjdf?sjmc=${id}`, { mainTable: { sjmc: id } }),
    request2.post('/api/dw/publish/shsj_zbyc', { param: { id }, pageNo: 1, pageSize: 999 })
  ]).then((res: any) => {
    const erroInfo = res[3]?.data[0] ?? {}
    delete erroInfo.sjmc
    return {
      ...res[0]?.datas[0].mainTable, // 商家信息
      highlights: res[0]?.datas[0].detail3 ?? [], // 商家展示
      dishes: res[0]?.datas[0].detail2 ?? [], // 商家菜品
      honors: res[0]?.datas[0].detail1 ?? [], // 商家荣誉
      comments: res[0]?.datas[0].detail5 ?? [], // 商家评论
      penalty: res[1]?.data?.[0], // 年度处罚
      score: res[2]?.datas?.[0]?.mainTable ?? {}, // 得分信息
      inspectImages: res[0]?.datas[0].detail4 ?? [], // 抽检信息
      erroInfo // 异常信息
    }
  })
}

// 提投诉
export const addComplaint = (data: Record<string, any>) => {
  return request.post(`${BASE_URL_SET}shsj_sjts`, data)
}

// 提评价
export const addComment = (data: Record<string, any>) => {
  return request.post(`/api/ebuilder/form/formdata/v2/updateFormData/shsj_sjpj`, data)
}

// 获取商家详情
export const getMerchantDetail = (id: string) => {
  return request.post(`${BASE_URL_GET}shsj_sjxxsjxq`, { mainTable: { id } })
}

// 获取商家指标异常信息
export const getMerchantAbnormal = (id: string) => {
  return request.post(`${BASE_URL_GET}shsj_sjzbyc`, { mainTable: { id } })
}
