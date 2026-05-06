import { token, userId } from '@/pages/constant/constant.ts'

/**上传文件 */
export const uploadFileApi = (filePath, fileName) => {
  //提示上传中
  uni.showLoading({
    title: '上传中',
    mask: true
  })
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: '/file/v2/common/upload?access_token=' + token, // 你的上传接口
      filePath: filePath,
      name: 'file',
      formData: {
        // 附带的额外表单数据
        module: 'document', //固定
        name: fileName,
        userid: userId //固定
      },
      success: ({ data }) => {
        console.log('uploadFile====::', JSON.parse(data))
        const result = JSON.parse(data)
        if (result.message.errcode === '0') {
          resolve(result.data.fileid)
        } else {
          reject(result.message.errmsg)
        }
      },
      fail: err => {
        reject(err)
        console.error('上传失败', err)
      },
      complete: () => {
        uni.hideLoading()
      }
    })
  })
}

export const getFileApi = (fileId: string, type?: string) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `/file/v2/common/download/${fileId}?userid=${userId}&access_token=${token}`,
      method: 'GET',
      responseType: 'arraybuffer',
      success: res => {
        if (res.statusCode === 200) {
          // console.log('222', res)
          // 将 ArrayBuffer 转换为 Base64 字符串
          const base64Data = uni.arrayBufferToBase64(res.data)
          const url = `data:${type || 'image/jpeg'};base64,${base64Data}`
          resolve(url)
        } else {
          reject(res.errMsg)
        }
      },
      fail: err => {
        reject(err)
        console.error('下载失败', err)
      }
    })
  })
}
