<template>
  <view class="hotline-page pt-[24rpx]">
    <view class="px-[24rpx] py-[30rpx] flex bg-white rounded-[16rpx] mx-[24rpx] hotline-item mb-[24rpx]">
      <image src="@/static/images/icon-tel.png" class="w-[48rpx] h-[48rpx]" mode="aspectFill" />
      <view class="ml-[16rpx] flex-1">
        <view class="pb-[24rpx] title text-[28rpx] text-[#000] font-[600] flex justify-between pt-[2rpx]">
          <view class="">可是</view>
          <view class="ml-auto">19900009999</view>
        </view>
        <view class="text-[24rpx] text-[#666] mt-[24rpx] break-all">55ddgg</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getMessageInfo } from '@/api/hotline.ts'

const hotlineList = ref([])
const fetchRequest = async () => {
  const res = await getMessageInfo({
    pageInfo: {
      pageNo: '1',
      pageSize: '1000'
    }
  })
  console.log('获取成功', res)
  hotlineList.value = res.datas
}
fetchRequest()
</script>
<style lang="scss" scoped>
.hotline-page {
  min-height: calc(100vh - var(--status-bar-height) - var(--window-top) - var(--window-bottom));
  position: relative;
  background: #f5f5f5;
  box-sizing: border-box;
}
.hotline-item {
  border: 1rpx solid #d9d9d9;
  .title {
    border-bottom: 1rpx solid #d9d9d9;
  }
}
</style>
