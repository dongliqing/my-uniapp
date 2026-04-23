<template>
  <view class="consult">
    <!-- 内容区 -->
    <scroll-view class="consult__scroll" scroll-y>
      <view class="consult__content">
        <view
          v-for="(item, index) in consultList"
          :key="index"
          class="consult__card"
        >
          <view class="consult__card-header">
            <view class="consult__dept">
              <image class="consult__dept-icon" src="/static/home/26.svg" mode="aspectFit" />
              <text class="consult__dept-name">{{ item.department }}</text>
            </view>
            <text class="consult__phone">{{ item.phone }}</text>
          </view>
          <view class="consult__divider" />
          <text class="consult__desc">{{ item.description }}</text>
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

const consultList = ref([
  {
    department: '食品安全监管科',
    phone: '19578012123',
    description: '负责食品生产、流通、餐饮服务环节的食品安全监督管理工作，组织开展食品安全专项整治。'
  },
  {
    department: '消费者权益保护科',
    phone: '19578012124',
    description: '受理消费者投诉举报，调解消费纠纷，查处侵害消费者权益的违法行为，开展消费教育引导工作。'
  },
  {
    department: '市场规范科',
    phone: '19578012125',
    description: '负责规范和维护市场经营秩序，监督管理市场交易行为，依法查处违法违规经营行为，维护公平竞争的市场环境。'
  }
])
</script>

<style lang="scss">
page {
  background: #F5F5F5;
}

.consult {
  min-height: 100vh;
  background: #F5F5F5;

  &__scroll {
    position: relative;
  }

  &__content {
    padding: 24rpx;
    padding-top: 46rpx;
  }

  &__card {
    background: #FDFDFD;
    border-radius: 16rpx;
    border: 1rpx solid #D9D9D9;
    padding: 30rpx 24rpx;
    margin-bottom: 24rpx;
  }

  &__card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__dept {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  &__dept-icon {
    width: 44rpx;
    height: 44rpx;
  }

  &__dept-name {
    font-size: 28rpx;
    color: #000;
  }

  &__phone {
    font-size: 28rpx;
    color: #000;
  }

  &__divider {
    height: 1rpx;
    background: #E5E5E5;
    margin: 20rpx 0;
  }

  &__desc {
    font-size: 24rpx;
    color: #666;
    line-height: 1.6;
    text-align: justify;
  }
}
</style>
