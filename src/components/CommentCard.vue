<template>
  <view class="comment-card">
    <!-- 左侧头像 -->
    <view class="comment-card__avatar-wrap">
      <image class="comment-card__avatar" :src="data.avatar" mode="aspectFill" />
    </view>

    <!-- 右侧内容区 -->
    <view class="comment-card__body">
      <!-- 第一行：昵称 + 日期 -->
      <view class="comment-card__header">
        <text class="comment-card__nickname">{{ data.xm || '测试' }}</text>
        <text class="comment-card__date">{{ data.pjrq }}</text>
      </view>

      <!-- 第二行：星级评分 + 评分文字 -->
      <view class="comment-card__rating-row">
        <view class="comment-card__stars">
          <image v-for="n in 5" :key="n" class="comment-card__star" :src="n <= data.xj ? starActive : starEmpty" mode="aspectFit" />
        </view>
        <text class="comment-card__rating-text">{{ data.xj }}星</text>
      </view>

      <!-- 评论内容 -->
      <text class="comment-card__content">{{ data.pj }}</text>

      <!-- 评论图片（3列） -->
      <view v-if="data.tp?.split(',') && data.tp.split(',').length" class="comment-card__images">
        <AImage class="comment-card__img" v-for="(img, i) in data.tp.split(',')" :key="i" :file-id="img"></AImage>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import AImage from './AImage.vue'
interface CommentData {
  id: number | string
  avatar: string
  xm: string
  xj: number
  pj: string
  tp?: string
  pjrq: string
}

const props = defineProps<{
  data: CommentData
}>()

// 星级图标 - 蓝色方角星
const starActive = '/static/images/svg/merchantDetail/star-active.svg'
const starEmpty = '/static/images/svg/merchantDetail/star-empty.svg'

/** 图片预览 */
</script>

<style lang="scss" scoped>
.comment-card {
  display: flex;
  gap: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;

  /* 头像区 */
  &__avatar-wrap {
    flex-shrink: 0;
  }

  &__avatar {
    width: 74rpx;
    height: 74rpx;
    border-radius: 50%;
    background: #cfdae8;
  }

  /* 内容区 */
  &__body {
    flex: 1;
    min-width: 0;
  }

  /* 第一行：昵称 + 日期 */
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12rpx;
  }

  &__nickname {
    font-size: 26rpx;
    font-weight: 500;
    color: #000;
  }

  &__date {
    font-size: 24rpx;
    color: #666;
    white-space: nowrap;
    flex-shrink: 0;
    margin-left: 20rpx;
  }

  /* 第二行：星级 + 评分文字 */
  &__rating-row {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 14rpx;
  }

  &__stars {
    display: flex;
    align-items: center;
    gap: 2rpx;
  }

  &__star {
    width: 28rpx;
    height: 28rpx;
  }

  &__rating-text {
    font-size: 24rpx;
    color: #666;
  }

  /* 评论内容 */
  &__content {
    font-size: 24rpx;
    color: #000;
    line-height: 1.7;
    text-align: justify;
    display: block;
    margin-bottom: 16rpx;
    word-break: break-all;
  }

  /* 图片列表（一行3张） */
  &__images {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16rpx;
  }

  &__img {
    aspect-ratio: 1;
    border-radius: 10rpx;
    background: #d9d9d9;
  }
}
</style>
