import request from '@/utils/request.ts'

//修改用户名
export const updateUsername = data => {
  return request.post('/api/user/updateUsername', data)
}

//修改头像
export const updateAvatar = data => {
  return request.post('/api/user/updateAvatar', data, { headers: { 'Content-Type': 'multipart/form-data' } })
}
