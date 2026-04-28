<template>
  <view class="interact-panel">
    <CommentCard v-for="(comment, idx) in comments" :key="idx" :data="comment" />
    <view v-if="!comments.length" class="interact-panel__empty">
      <text>暂无评论</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import CommentCard from '@/components/CommentCard.vue'

interface CommentItem {
  id: number | string
  avatar: string
  nickname: string
  rating: number
  content: string
  images?: string[]
  time: string
}

defineProps<{
  comments: CommentItem[]
}>()
</script>

<style lang="scss" scoped>
.interact-panel {
  padding: 0;

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80rpx 0;
    text {
      font-size: 26rpx;
      color: #999;
    }
  }
}
</style>
