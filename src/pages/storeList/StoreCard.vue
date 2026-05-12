<template>
  <view class="merchant-card" @tap="goDetail">
    <view class="merchant-card__top">
      <!-- 商家图片 -->

      <view class="merchant-card__img-wrap">
        <AImage class="merchant-card__img" :file-id="data.image" />
      </view>

      <!-- 商家信息 -->
      <view class="merchant-card__info">
        <text class="merchant-card__name">{{ data.storeName }}</text>

        <!-- 星级和评分 -->
        <view class="merchant-card__rating">
          <view class="merchant-card__stars">
            <image v-for="i in data.star" :key="i + 'active'" :mode="aspectFit" class="merchant-card__star" src="/static/images/svg/star-active.svg" mode="aspectFit" />
            <image v-for="i in 5 - data.star" :key="i + 'gray'" class="merchant-card__star" src="/static/images/svg/star-default.svg" mode="aspectFit" />
          </view>
          <!-- <text class="merchant-card__score">90分</text> -->
          <text class="merchant-card__distance">2.3km</text>
        </view>

        <!-- 分类和区域 -->
        <view class="merchant-card__meta">
          <text v-for="(item, index) in data.tags" :key="index + 'tag'" class="merchant-card__area">{{ item }}</text>
        </view>

        <!-- 标签 -->
        <view class="merchant-card__tags">
          <view class="merchant-card__year-tag">
            <image class="merchant-card__year-icon" src="/static/images/icon-store.png" mode="aspectFit" />
            <text class="merchant-card__year-text">{{ YearTypeMap[Number(data.yearType)] }}</text>
          </view>
          <!-- <view class="merchant-card__badge">缙云传味</view> -->
        </view>
      </view>
    </view>
    <!-- 投诉信息 -->
    <view class="merchant-card__stats">
      <view class="flex items-center">
        <image class="merchant-card__stats-icon" src="/static/images/warn-red.png" mode="aspectFit" />
        <text class="merchant-card__stats-text ml-[12rpx]">年度投诉{{ data.complaint || 0 }}件</text>
        <text class="merchant-card__stats-text ml-[20rpx]">立案查处{{ data.caseHandle || 0 }}件</text>
      </view>

      <!-- 状态标签 -->
      <view class="merchant-card__status" :class="`status_${data.statusNo}`">
        <text class="merchant-card__status-text">{{ data.statusLabel }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { YearTypeMap, StatusMap } from './constant.ts';
import AImage from '@/components/AImage.vue';

interface IStore {
  id: number;
  storeName: string;
  address: string;
  image: string;
  star: number;
  yearType: string;
  tags: string[];
  statusNo: string;
  statusLabel: string;
  complaint: string;
  caseHandle: string;
}

const props = defineProps<{
  data: IStore;
}>();

const emit = defineEmits<{
  click: [id: string | number];
}>();

function goDetail() {
  // emit('click', props.data.id)
  uni.navigateTo({
    url: '/pages/merchantDetail/index?id=' + props.data.id
  });
}
</script>

<style lang="scss" scoped>
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
    height: 38rpx;
    line-height: 30rpx;
    text-align: center;

    &.status_0 {
      background: #edf5ff;
      border-color: #afd3ff;

      .merchant-card__status-text {
        color: #1882fc;
      }
    }

    &.status_1 {
      background: #f1f1f1;
      border-color: #999;

      .merchant-card__status-text {
        color: #666;
      }
    }

    &.status_2 {
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
