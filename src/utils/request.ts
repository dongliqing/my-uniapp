// 全局基础请求地址，可根据开发/生产环境动态切换
// const BASE_URL =/ 'http://www.syncbase.cn:20600/papi/openapi/api/ebuilder/form/formdata/v2/getFormDataList'

/**
 * 通用请求封装
 * @param {Object} options 请求配置项
 * @param {String} options.url 接口路径（会自动拼接 BASE_URL）
 * @param {String} options.method 请求方法（默认 GET）
 * @param {Object} options.data 请求参数
 * @param {Boolean} options.needToken 是否需要携带 token（默认 true）
 * @param {Boolean} options.needLoading 是否需要显示加载动画（默认 true）
 * @param {Object} options.header 自定义请求头
 */
const request = (options = {}) => {
  // 1. 默认配置与参数合并
  const { url, method = 'GET', data = {}, needToken = true, needLoading = false, header = {} } = options

  // 2. 处理加载动画
  if (needLoading) {
    uni.showLoading({ title: '加载中...', mask: true })
  }

  // 3. 处理请求头（自动携带 Token）
  const defaultHeader = {
    'Content-Type': 'application/json',
    ...header
  }

  let finalUrl = url
  if (needToken) {
    const token = uni.getStorageSync('token') || '5bebac6034384d79b48fcf097491374a'
    if (token) {
      //   defaultHeader['Authorization'] = token // 根据后端要求，也可能是 'Bearer ' + token
      finalUrl = url + '?access_token=' + token
    }
  }

  // 4. 返回 Promise 对象
  return new Promise((resolve, reject) => {
    uni.request({
      url: finalUrl,
      method: method.toUpperCase(),
      data: {
        datajson: {
          mainTable: data?.mainTable ?? {},
          ...data,
          header: {
            operator: 'sysadmin' //固定
          }
        }
      },
      header: defaultHeader,
      timeout: 10000, // 超时时间
      success: res => {
        // 统一处理 HTTP 状态码
        if (res.statusCode === 200) {
          // 这里可以根据后端返回的业务状态码做进一步处理
          // 例如：if (res.data.code === 10086) { 跳转登录 }
          resolve(res.data.datajson)
        } else if (res.statusCode === 401) {
          // 凭证失效，清除本地 token 并跳转登录页
          uni.removeStorageSync('token')
          uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
          // setTimeout(() => {
          //   uni.navigateTo({ url: '/pages/login/login' })
          // }, 1500)
          reject(res)
        } else {
          uni.showToast({ title: '请求异常', icon: 'none' })
          reject(res)
        }
      },
      fail: err => {
        uni.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      },
      complete: () => {
        // 无论成功失败，都关闭加载动画
        if (needLoading) {
          uni.hideLoading()
        }
      }
    })
  })
}

// 导出便捷的请求方法
export default {
  get(url, data = {}, config = {}) {
    return request({ url, method: 'GET', data, ...config })
  },
  post(url, data = {}, config = {}) {
    return request({ url, method: 'POST', data, ...config })
  },
  put(url, data = {}, config = {}) {
    return request({ url, method: 'PUT', data, ...config })
  },
  delete(url, data = {}, config = {}) {
    return request({ url, method: 'DELETE', data, ...config })
  }
}
