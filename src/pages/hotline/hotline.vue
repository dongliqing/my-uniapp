<template>
  <view class="hotline-page pt-[24rpx]">
    <view v-for="(item, index) in hotlineList" :key="index" class="px-[24rpx] py-[30rpx] flex bg-white rounded-[16rpx] mx-[24rpx] hotline-item mb-[24rpx]">
      <image src="@/static/images/icon-tel.png" class="w-[48rpx] h-[48rpx]" mode="aspectFill" />
      <view class="ml-[16rpx] flex-1">
        <view class="pb-[24rpx] title text-[28rpx] text-[#000] font-[600] flex justify-between pt-[2rpx]">
          <view class="">{{ item.department }}</view>
          <view class="ml-auto">{{ item.phone }}</view>
        </view>
        <view class="text-[24rpx] text-[#666] mt-[24rpx] break-all">{{ item.intro || '暂无简介' }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getMessageInfo } from '@/api/hotline.ts';

const hotlineList = ref<{ department: string; phone: string; intro?: string }[]>([]);
const fetchRequest = async () => {
  const res = await getMessageInfo({
    pageInfo: {
      pageNo: '1',
      pageSize: '1000'
    }
  });
  // console.log('获取成功', res);
  hotlineList.value = (res.datas || []).map(e => {
    return {
      department: e.mainTable.ks,
      phone: e.mainTable.lxdh,
      intro: e.mainTable.jj || ''
    };
  });
};
fetchRequest();
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
