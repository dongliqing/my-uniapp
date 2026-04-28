import request from '@/utils/request.ts'

// 获取资讯信息
export const getMessageInfo = data => {
  return request.post('/v2/getFormDataList/shsj_zxxx', data)
}

// export const userLogin = (data) => {
//   return request.post('/api/user/login', data, { needToken: false });
// };
