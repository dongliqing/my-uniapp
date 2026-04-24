<template>
  <view class="comment-card">
    <!-- 头部：头像 + 昵称 + 评分 + 时间 -->
    <view class="comment-card__header">
      <image class="comment-card__avatar" :src="data.avatar" mode="aspectFill" />
      <view class="comment-card__user-info">
        <text class="comment-card__nickname">{{ data.nickname }}</text>
        <view class="comment-card__meta-row">
          <view class="comment-card__stars">
            <image
              v-for="n in 5"
              :key="n"
              class="comment-card__star"
              :src="n <= data.rating ? '/static/detail/21.svg' : '/static/detail/16.svg'"
              mode="aspectFit"
            />
          </view>
          <text class="comment-card__time">{{ data.time }}</text>
        </view>
      </view>
    </view>

    <!-- 评论内容 -->
    <text class="comment-card__content">{{ data.content }}</text>

    <!-- 图片（支持预览） -->
    <view v-if="data.images && data.images.length" class="comment-card__images">
      <image
        v-for="(img, i) in data.images"
        :key="i"
        class="comment-card__img"
        :src="img"
        mode="aspectFill"
        @tap.stop="onPreview(img)"
      />
    </view>

    <!-- 底部操作：点赞 -->
    <view class="comment-card__footer">
      <view class="comment-card__like-btn" @tap="handleLike">
        <image
          class="comment-card__like-icon"
          :src="isLiked ? '/assets/CodeBuddyAssets/0_1953/23.svg' : '/assets/CodeBuddyAssets/0_1953/24.svg'"
          mode="aspectFit"
        />
        <text :class="{ 'comment-card__like-text--active': isLiked }">{{ displayLikes }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface CommentData {
  id: number | string
  avatar: string
  nickname: string
  rating: number
  content: string
  images?: string[]
  time: string
  likes: number
}

const props = defineProps<{
  data: CommentData
}>()

const isLiked = ref(false)
const likeCount = ref(props.data.likes)

const displayLikes = computed(() => likeCount.value)

/** 图片预览 */
function onPreview(currentImg: string) {
  if (!props.data.images || props.data.images.length === 0) return
  uni.previewImage({
    current: currentImg,
    urls: props.data.images!
  })
}

/** 点赞 */
function handleLike() {
  if (isLiked.value) {
    isLiked.value = false
    likeCount.value--
  } else {
    isLiked.value = true
    likeCount.value++
  }
}
</script>

<style lang="scss" scoped>
.comment-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;

  /* 头部 */
  &__header {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 16rpx;
  }
  &__avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: #EEE;
    flex-shrink: 0;
  }
  &__user-info {
    flex: 1;
    min-width: 0;
  }
  &__nickname {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    display: block;
    margin-bottom: 6rpx;
  }
  &__meta-row {
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
    width: 22rpx;
    height: 22rpx;
  }
  &__time {
    font-size: 22rpx;
    color: #999;
  }

  /* 内容 */
  &__content {
    font-size: 26rpx;
    color: #333;
    line-height: 1.7;
    display: block;
    margin-bottom: 12rpx;
  }

  /* 图片列表 */
  &__images {
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
    margin-bottom: 16rpx;
  }
  &__img {
    width: 180rpx;
    height: 180rpx;
    border-radius: 10rpx;
  }

  /* 底部操作 */
  &__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 8rpx;
    border-top: 1rpx solid #F5F5F5;
  }
  &__like-btn {
    display: flex;
    align-items: center;
    gap: 6rpx;
  }
  &__like-icon {
    width: 32rpx;
    height: 32rpx;
  }
  &__like-text--active,
  &__like-btn text {
    font-size: 24rpx;
    color: #999;

    &.comment-card__like-text--active {
      color: #1782FC;
    }
  }
}
</style>
