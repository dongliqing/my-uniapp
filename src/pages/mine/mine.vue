<template>
  <view class="mine-page">
    <!-- 顶部背景 -->
    <view class="top-gradient">
      <image class="wave-decoration" src="@/static/images/mine-bg.svg" mode="aspectFill" />
    </view>
    <view class="pt-[212rpx] flex items-center px-[36rpx] relative z-[9]">
      <!-- 头像用户名 -->
      <image class="w-[120rpx] h-[120rpx] rounded-full" src="@/static/images/avatar.png" mode="aspectFill" @tap="editAvatar" />
      <view class="ml-[24rpx] flex items-center" @tap="editUserName">
        <!-- 颜色设置为黑色 -->
        <text class="text-[30rpx] text-[#000] mr-[16rpx] username pb-[4rpx]">用户昵称</text>
        <uni-icons type="forward" size="34rpx" color="#333" class="" />
      </view>
    </view>
    <view class="mt-[66rpx] rounded-[30rpx_30rpx_0_0] bg-[#f5f5f5] relative z-[9] h-[400rpx] p-[36rpx]">
      <view class="flex items-center">
        <image class="w-[60rpx] h-[60rpx]" src="@/static/images/icon-exchange.svg" mode="aspectFill" />
        <text class="text-[26rpx] text-[#000] ml-[24rpx]">切换商家版</text>
        <uni-icons type="forward" size="32rpx" color="#333" class="ml-auto" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const editUserName = () => {}
const editAvatar = () => {
  // 选择图片
  uni.chooseImage({
    count: 1, // 最多选择几张
    sizeType: ['compressed'], // 指定是原图还是压缩图
    sourceType: ['camera', 'album'], // 指定来源是相机还是相册
    success: res => {
      const tempFilePath = res.tempFilePaths[0]
      // 2. 上传到开发者服务器
      uploadFile(tempFilePath)
    }
  })
}

// 执行上传
function uploadFile(filePath: string) {
  uni.uploadFile({
    url: 'https://你的服务器地址/upload', // 你的上传接口
    filePath: filePath,
    name: 'file',
    formData: {
      // 附带的额外表单数据
      userId: ''
    },
    success: uploadRes => {
      console.log('上传成功', uploadRes.data)
    },
    fail: err => {
      console.error('上传失败', err)
    }
  })
}

const fileList = ref([])
const handleSelect = e => {
  // 获取选中的图片本地临时路径数组
  const tempFilePaths = e.tempFilePaths

  // 遍历上传（如果是多图上传）
  tempFilePaths.forEach(path => {
    uni.uploadFile({
      url: 'https://你的后端接口地址/upload', // 替换成你真实的接口地址
      filePath: path, // 要上传的文件资源路径
      name: 'file', // 后端接收文件的字段名（例如 'file', 'image' 等）
      header: {
        // 如果需要鉴权，可以在这里添加 token
        Authorization: 'Bearer ' + uni.getStorageSync('token')
      },
      formData: {
        // 附带的其他表单数据（如果后端需要）
        userId: '12345'
      },
      success: uploadFileRes => {
        console.log('上传成功', JSON.parse(uploadFileRes.data))
        // 这里可以处理后端返回的图片URL，并更新 fileList 用于回显
      },
      fail: err => {
        console.error('上传失败', err)
      }
    })
  })
}
</script>
<style lang="scss" scoped>
.mine-page {
  min-height: 100vh;
  position: relative;
  background: #f5f5f5;

  .top-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 612rpx;
    z-index: 0;
    .wave-decoration {
      width: 100%;
      height: 100%;
    }
  }
}

.username {
  font-weight: 600;
}
</style>
