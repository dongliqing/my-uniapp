<template>
  <view class="merchant-card" @tap="goDetail">
    <view class="merchant-card__top">
      <!-- 商家图片 -->

      <view class="merchant-card__img-wrap">
        <image class="merchant-card__img" :src="data.img" mode="aspectFill" />
      </view>

      <!-- 商家信息 -->
      <view class="merchant-card__info">
        <text class="merchant-card__name">{{ data.name }}</text>

        <!-- 星级和评分 -->
        <view class="merchant-card__rating">
          <view class="merchant-card__stars">
            <image v-for="n in 5" :key="n" class="merchant-card__star"
              :src="n <= data.stars ? '/static/images/svg/star-active.svg' : '/static/images/svg/star-default.svg'"
              mode="aspectFit" />
          </view>
          <text class="merchant-card__score">{{ data.score }}分</text>
          <text class="merchant-card__distance">{{ data.distance }}2.3km</text>
        </view>

        <!-- 分类和区域 -->
        <view class="merchant-card__meta">
          <text class="merchant-card__area">222</text>
          <text class="merchant-card__area">222</text>
          <text class="merchant-card__area">222</text>
        </view>

        <!-- 标签 -->
        <view class="merchant-card__tags">
          <view class="merchant-card__year-tag">
            <image class="merchant-card__year-icon" src="/static/images/icon-store.png" mode="aspectFit" />
            <text class="merchant-card__year-text">{{ data.year }}100年店铺</text>
          </view>
          <view class="merchant-card__badge">{{ data.badge }}缙云传味</view>
          <view class="merchant-card__badge">{{ data.badge }}缙云传味</view>
        </view>
      </view>
    </view>
    <!-- 投诉信息 -->
    <view class="merchant-card__stats">
      <view class="flex items-center">
        <image class="merchant-card__stats-icon" src="/static/images/warn-red.png" mode="aspectFit" />
        <text class="merchant-card__stats-text ml-[12rpx]">年度投诉{{ data.complaint || 0 }}件</text>
        <text class="merchant-card__stats-text ml-[20rpx]">立案查处{{ data.penalty || 0 }}件</text>
      </view>

      <!-- 状态标签 -->
      <view class="merchant-card__status high" :class="data.status">
        <text class="merchant-card__status-text">{{ statusText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface MerchantData {
  id: string | number
  name: string
  img: string
  stars: number
  score: number
  distance: string
  category: string
  area: string
  year: number
  badge: string
  badge2?: string
  complaint: number
  penalty: number
  status: 'normal' | 'rectify' | 'high'
}

const props = defineProps<{
  data: MerchantData
}>()

const emit = defineEmits<{
  click: [id: string | number]
}>()

const statusText = computed(() => {
  const map = {
    normal: '正常经营',
    rectify: '整改中',
    high: '高风险'
  }
  return map[props.data.status] || '整改中'
})

function goDetail() {
  emit('click', props.data.id)
}
</script>

<style lang="scss">
.merchant-card {
  background: #fff;
  border-radius: 16rpx;
  position: relative;
  margin-bottom: 20rpx;

  &__top {
    margin: 0 16rpx;
    padding: 16rpx 0 20rpx;
    display: flex;
    border-bottom: 1rpx solid #d9d9d9;
  }

  &__img-wrap {
    width: 166rpx;
    height: 166rpx;
    margin-right: 16rpx;
    border-radius: 8rpx;
    overflow: hidden;
    flex-shrink: 0;
    background: #d9d9d9;
  }

  &__img {
    width: 100%;
    height: 100%;
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    justify-content: space-between;
  }

  &__name {
    font-size: 30rpx;
    font-weight: 500;
    color: #000;
    line-height: 1.4;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }

  &__stars {
    display: flex;
    align-items: center;
    gap: 4rpx;
  }

  &__star {
    width: 24rpx;
    height: 24rpx;
  }

  &__score {
    font-size: 24rpx;
    color: #1882fc;
    font-weight: 500;
  }

  &__distance {
    font-size: 24rpx;
    color: #333;
    margin-left: auto;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 24rpx;
  }

  &__area {
    font-size: 24rpx;
    color: #666;
  }

  &__tags {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-wrap: wrap;
  }

  &__year-tag {
    display: flex;
    align-items: center;
    background: rgba(255, 192, 155, 0.3);
    border-radius: 1rpx;
    // padding: 0 12rpx;
    height: 32rpx;
    width: 155rpx;
    // gap: 8rpx;
    position: relative;
    justify-content: center;
  }

  &__year-icon {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  &__year-text {
    position: relative;
    z-index: 8;
    font-size: 22rpx;
    color: #823822;
    text-indent: 32rpx;
    text-align: center;
  }

  &__badge {
    background: #fff3e1;
    border-radius: 2rpx;
    border: 1rpx solid #efce9c;
    padding: 0 10rpx;
    height: 32rpx;
    display: flex;
    align-items: center;
    font-size: 22rpx;
    color: #b2823a;
  }

  &__stats {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // margin-top: 20rpx;
    padding: 20rpx 16rpx;
  }

  &__stats-icon {
    width: 32rpx;
    height: 32rpx;
  }

  &__stats-text {
    font-size: 24rpx;
    color: #333;
  }

  &__status {
    border-radius: 2rpx;
    border: 1rpx solid #ccc;
    width: 115rpx;
    height: 30rpx;
    line-height: 30rpx;
    text-align: center;

    &.normal {
      background: #edf5ff;
      border-color: #afd3ff;

      .merchant-card__status-text {
        color: #1882fc;
      }
    }

    &.rectify {
      background: #f1f1f1;
      border-color: #999;

      .merchant-card__status-text {
        color: #666;
      }
    }

    &.high {
      background: #ffe9e5;
      border-color: #f23212;

      .merchant-card__status-text {
        color: #f23212;
      }
    }
  }

  &__status-text {
    font-size: 24rpx;
  }
}
</style>
