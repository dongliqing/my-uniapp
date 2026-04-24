<template>
  <view class="check">
    <!-- 主滚动区 -->
    <scroll-view class="check__scroll" scroll-y>
      <view class="check__content">
        <!-- 活动列表 -->
        <view v-for="(item, idx) in activityList" :key="idx" class="check__card">
          <view class="check__card-header">
            <text class="check__card-name">{{ item.title }}</text>
            <text class="check__card-status" :class="item.ongoing ? 'check__card-status--active' : 'check__card-status--ended'">
              {{ item.ongoing ? '进行中' : '已结束' }}
            </text>
          </view>
          <text class="check__card-time">活动时间：{{ item.time }}</text>
          <view class="check__card-footer">
            <view class="check__card-btn" :class="item.ongoing ? 'check__card-btn--primary' : 'check__card-btn--outline'" @tap="goDetail(item)">
              <text class="check__card-btn-text" :class="item.ongoing ? '' : 'check__card-btn-text--outline'">
                {{ item.ongoing ? '去看看' : '查看详情' }}
              </text>
            </view>
          </view>
        </view>

        <!-- TabBar 占位 -->
        <view style="height: 160rpx" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
const activityList = ref([
  {
    id: 1,
    title: '炎炎夏日 饮品安全我想查',
    time: '2025-07-01至2025-12-31',
    ongoing: true
  },
  {
    id: 2,
    title: '炎炎夏日 饮品安全我想查',
    time: '2025-07-01至2025-12-31',
    ongoing: false
  },
  {
    id: 3,
    title: '炎炎夏日 饮品安全我想查',
    time: '2025-07-01至2025-12-31',
    ongoing: true
  },
  {
    id: 4,
    title: '炎炎夏日 饮品安全我想查',
    time: '2025-07-01至2025-12-31',
    ongoing: false
  }
])

const goDetail = (item: any) => {
  uni.navigateTo({ url: `/pages/checkDetail/index?id=${item.id}` })
}
</script>

<style lang="scss">
.check {
  min-height: 100vh;
  background: #f5f5f5;

  &__nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    overflow: hidden;
    background: #fff;
  }
  &__nav-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    pointer-events: none;
  }
  &__nav-bar {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24rpx;
  }
  &__nav-title {
    font-size: 34rpx;
    font-weight: 500;
    color: #000;
  }

  &__scroll {
    position: relative;
  }

  &__content {
    padding: 24rpx;
  }

  &__card {
    background: #fdfdfd;
    border-radius: 16rpx;
    border: 1rpx solid #d9d9d9;
    padding: 30rpx 24rpx;
    margin-bottom: 24rpx;
    position: relative;
    min-height: 190rpx;
  }
  &__card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 40rpx;
  }
  &__card-name {
    font-size: 30rpx;
    font-weight: 500;
    color: #000;
    flex: 1;
    margin-right: 16rpx;
    line-height: 1.4;
  }
  &__card-status {
    font-size: 28rpx;
    font-weight: 500;
    white-space: nowrap;
    &--active {
      color: #1782fc;
    }
    &--ended {
      color: #999;
    }
  }
  &__card-time {
    font-size: 24rpx;
    color: #666;
    position: absolute;
    bottom: 70rpx;
    left: 24rpx;
  }
  &__card-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 60rpx;
  }
  &__card-btn {
    width: 130rpx;
    height: 52rpx;
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    &--primary {
      background: linear-gradient(237deg, #1782fc 0%, #46b2ff 100%);
    }
    &--outline {
      background: #fff;
      border: 2rpx solid #1782fc;
    }
  }
  &__card-btn-text {
    font-size: 26rpx;
    color: #fff;
    &--outline {
      color: #1782fc;
    }
  }

  /* TabBar */
  &__tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 999;
    padding-bottom: env(safe-area-inset-bottom);
  }
  &__tabbar-line {
    height: 1rpx;
    background: #eee;
  }
  &__tabbar-inner {
    height: 120rpx;
    display: flex;
    align-items: flex-end;
    padding: 0 40rpx 16rpx;
  }
  &__tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6rpx;
    &--center {
      position: relative;
      top: -16rpx;
    }
  }
  &__tab-icon {
    width: 70rpx;
    height: 70rpx;
  }
  &__tab-text {
    font-size: 22rpx;
    color: #999;
    &--active {
      color: #1782fc;
    }
  }
}
</style>
