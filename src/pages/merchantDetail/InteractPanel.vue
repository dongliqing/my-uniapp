<template>
  <scroll-view
    class="interact-panel"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="loadMore"
    style="height: calc(100vh - 500rpx)"
  >
    <view class="interact-panel__inner">
      <view v-for="(comment, idx) in comments" :key="comment.id || idx" class="comment-card">
        <!-- 头像 -->
        <image class="comment-card__avatar" :src="comment.avatar" mode="aspectFill" />

        <!-- 评论内容区 -->
        <view class="comment-card__body">
          <!-- 昵称 + 日期 -->
          <view class="comment-card__header">
            <text class="comment-card__nickname">{{ comment.nickname }}</text>
            <text class="comment-card__date">{{ comment.time }}</text>
          </view>

          <!-- 星级评分 -->
          <view class="comment-card__stars">
            <image
              v-for="n in 5"
              :key="n"
              class="comment-card__star"
              :src="n <= comment.rating ? '/static/images/svg/merchantDetail/23.svg' : '/static/images/svg/merchantDetail/25.svg'"
              mode="aspectFit"
            />
            <image
              class="comment-card__star-half"
              src="/static/images/svg/merchantDetail/31.svg"
              mode="aspectFit"
              v-if="comment.rating % 1 !== 0"
            />
            <text class="comment-card__rating-text"> {{ comment.rating }}星</text>
          </view>

          <!-- 评论内容 -->
          <text class="comment-card__content">{{ comment.content }}</text>

          <!-- 评论图片（支持预览） -->
          <view v-if="comment.images && comment.images.length" class="comment-card__images">
            <image
              v-for="(img, i) in comment.images"
              :key="i"
              class="comment-card__img"
              :src="img"
              mode="aspectFill"
              @tap.stop="previewImages(i, comment.images!)"
            />
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="interact-panel__loading">
        <text>加载中...</text>
      </view>
      <view v-else-if="noMore && comments.length > 0" class="interact-panel__nomore">
        <text>— 没有更多了 —</text>
      </view>
      <view v-if="comments.length === 0 && !loading" class="interact-panel__empty">
        <text>暂无评论</text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface CommentItem {
  id: number | string
  avatar: string
  nickname: string
  rating: number
  content: string
  images?: string[]
  time: string
}

const props = defineProps<{
  comments: CommentItem[]
  loading?: boolean
  noMore?: boolean
}>()

const emit = defineEmits<{
  (e: 'loadMore'): void
}>()

const scrollTop = ref(0)

function loadMore() {
  if (!props.loading && !props.noMore) {
    emit('loadMore')
  }
}

function previewImages(index: number, urls: string[]) {
  uni.previewImage({ current: urls[index], urls })
}
</script>

<style lang="scss" scoped>
.interact-panel {
  padding: 24rpx;

  &__inner {
    min-height: 200rpx;
  }

  &__loading,
  &__nomore,
  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx 0;
    text {
      font-size: 26rpx;
      color: #999;
    }
  }
}
.comment-card {
  display: flex;
  gap: 20rpx;
  background: #fff;
  border-radius: 10rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;

  /* 头像 */
  &__avatar {
    width: 74rpx; /* 设计图中约74x65 */
    height: 65rpx;
    border-radius: 4rpx;
    flex-shrink: 0;
    background: #f0f0f0;
  }

  /* 内容区 */
  &__body {
    flex: 1;
    min-width: 0;
  }

  /* 昵称 + 日期 */
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
    flex-shrink: 0;
  }

  /* 星级 */
  &__stars {
    display: flex;
    align-items: center;
    gap: 2rpx;
    margin-bottom: 12rpx;
  }
  &__star {
    width: 28rpx;
    height: 28rpx;
  }
  &__star-half {
    width: 14rpx;
    height: 28rpx;
  }
  &__rating-text {
    font-size: 24rpx;
    color: #666;
    margin-left: 12rpx;
  }

  /* 评论内容 */
  &__content {
    font-size: 24rpx;
    color: #000;
    line-height: 1.6;
    display: block;
    margin-bottom: 16rpx;
  }

  /* 评论图片网格（3列） */
  &__images {
    display: flex;
    gap: 16rpx;
    flex-wrap: wrap;
  }
  &__img {
    width: 198rpx;
    height: 198rpx;
    border-radius: 10rpx;
  }
}
</style>
