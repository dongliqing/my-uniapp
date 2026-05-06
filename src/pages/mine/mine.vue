<template>
  <view class="mine-page">
    <!-- 顶部背景 -->
    <view class="top-gradient">
      <image class="wave-decoration" src="@/static/images/mine-bg.svg" mode="aspectFill" />
    </view>
    <view class="pt-[212rpx] flex items-center px-[36rpx] relative z-[9]">
      <!-- 头像用户名 -->
      <image v-if="avatarUrl" class="w-[120rpx] h-[120rpx] rounded-full" :src="avatarUrl" mode="aspectFill" @tap="editAvatar" />
      <image v-else class="w-[120rpx] h-[120rpx] rounded-full" src="@/static/images/avatar.png" mode="aspectFill" @tap="editAvatar" />
      <view class="ml-[24rpx] flex items-center" @tap="editUserName">
        <!-- 颜色设置为黑色 -->
        <text class="text-[30rpx] text-[#000] mr-[16rpx] username pb-[4rpx]">{{ username || '用户昵称' }}</text>
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
import { uploadFileApi, getFileApi } from '@/api/common.ts'

const avatarUrl = ref('')
const username = ref('')

// const fileId = ref('')
// const type = ref('')

const editUserName = () => {
  //弹出一个输入框
  uni.showModal({
    title: '修改用户名',
    // content: '请输入用户名',
    editable: true,
    success: res => {
      // 修改用户名
      console.log(res)
      username.value = res.content
    }
  })
}
const editAvatar = () => {
  // 选择图片
  uni.chooseImage({
    count: 1, // 最多选择几张
    sizeType: ['compressed'], // 指定是原图还是压缩图
    sourceType: ['camera', 'album'], // 指定来源是相机还是相册
    success: async res => {
      const tempFilePath = res.tempFilePaths[0]
      const fileName = res.tempFiles[0].name
      const type = res.tempFiles[0].type

      // 上传到服务器
      const fileid = await uploadFileApi(tempFilePath, fileName)
      // console.log(fileid, type)
      // fileId.value = fileid
      // type.value = type

      //下载图片资源
      const url = await getFileApi(fileid, type)
      avatarUrl.value = url
    }
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
