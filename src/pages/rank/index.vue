<template>
  <view class="rank-list">
    <!-- 内容区 -->
    <scroll-view class="rank-list__scroll" scroll-y>
      <view class="rank-list__content">
        <view
          v-for="(item, index) in rankList"
          :key="index"
          class="rank-list__item"
          @tap="goDetail(item)"
        >
          <text class="rank-list__item-title">{{ item.title }}</text>
          <text class="rank-list__item-date">{{ item.date }}</text>
        </view>
      </view>

      <!-- TabBar 占位 -->
      <view style="height: 160rpx;" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'


onMounted(() => {
})

const rankList = ref([
  { title: '第三期"红黑榜"结果', date: '2025-10-21', id: 3 },
  { title: '第二期"红黑榜"结果', date: '2025-05-06', id: 2 },
  { title: '第一期"红黑榜"结果', date: '2025-03-03', id: 1 }
])

function goDetail(item: any) {
  uni.navigateTo({ url: `/pages/detail/index?type=rank&id=${item.id}` })
}
</script>

<style lang="scss">
page {
  background: #F5F5F5;
}

.rank-list {
  min-height: 100vh;
  background: #F5F5F5;

  &__scroll {
    position: relative;
  }

  &__content {
    padding: 24rpx;
    padding-top: 46rpx;
  }

  &__item {
    background: #FDFDFD;
    border-radius: 16rpx;
    border: 1rpx solid #D9D9D9;
    padding: 32rpx 24rpx;
    margin-bottom: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__item-title {
    font-size: 26rpx;
    color: #000;
  }

  &__item-date {
    font-size: 24rpx;
    color: #666;
  }
}
</style>
