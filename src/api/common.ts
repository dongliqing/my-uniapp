import { token, userId, API_BASE_URL } from '@/pages/constant/constant.ts';

let baseUrl = '';
// #ifdef H5
baseUrl = ''; // H5 端走本地代理
// #endif
// #ifdef MP-WEIXIN
baseUrl = API_BASE_URL; // MP 端走线上环境
// #endif

if (import.meta.env.NODE_ENV === 'production') {
  baseUrl = API_BASE_URL;
}

/**上传文件 */
export const uploadFileApi = (filePath, fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  const allowTypes = ['jpg', 'jpeg', 'png'];

  return new Promise((resolve, reject) => {
    //格式校验
    if (!allowTypes.includes(extension)) {
      uni.showToast({ title: '仅支持 jpg/jpeg/png 格式的图片', icon: 'none' });
      reject('文件格式错误');
      return;
    }

    //提示上传中
    uni.showLoading({
      title: '上传中',
      mask: true
    });

    const url = '/api/file/v2/common/upload?access_token=' + token;
    uni.uploadFile({
      url: baseUrl + url, // 你的上传接口
      filePath: filePath,
      name: 'file',
      formData: {
        // 附带的额外表单数据
        module: 'document', //固定
        name: fileName,
        userid: userId //固定
      },
      success: ({ data }) => {
        console.log('uploadFile====::', JSON.parse(data));
        const result = JSON.parse(data);
        if (result.message.errcode === '0') {
          resolve(result.data.fileid);
        } else {
          reject(result.message.errmsg);
        }
      },
      fail: err => {
        reject(err);
        console.error('上传失败', err);
      },
      complete: () => {
        uni.hideLoading();
      }
    });
  });
};

export const getFileApi = (fileId: string) => {
  return new Promise((resolve, reject) => {
    const url = `/api/file/v2/common/download/${fileId}?userid=${userId}&access_token=${token}`;
    uni.request({
      url: baseUrl + url, // 你的上传接口
      method: 'GET',
      responseType: 'arraybuffer',
      success: res => {
        if (res.statusCode === 200) {
          // console.log('222', res)
          resolve(res.data);
        } else {
          reject(res.errMsg);
        }
      },
      fail: err => {
        reject(err);
        console.error('下载失败', err);
      }
    });
  });
};
