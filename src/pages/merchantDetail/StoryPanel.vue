<template>
  <view class="story-panel">
    <view v-for="(story, idx) in stories" :key="idx" class="story-block">
      <text class="story-block__title">{{ story.title }}</text>
      <text class="story-block__desc">{{ story.content }}</text>
      <view v-if="story.images && story.images.length" class="story-block__images">
        <image
          v-for="(img, i) in story.images"
          :key="i"
          class="story-block__img"
          :src="img"
          mode="aspectFill"
          @tap.stop="previewImages(i, story.images!)"
        />
      </view>
    </view>
    <view v-if="stories.length === 0" class="story-panel__empty"><text>暂无商家故事</text></view>
  </view>
</template>

<script setup lang="ts">
interface StoryItem {
  title: string
  content: string
  images?: string[]
}

defineProps<{
  stories: StoryItem[]
}>()

function previewImages(index: number, urls: string[]) {
  uni.previewImage({ current: urls[index], urls })
}
</script>

<style lang="scss" scoped>
.story-panel {
  padding: 24rpx;

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80rpx 0;
    text {
      font-size: 28rpx;
      color: #999;
    }
  }
}
.story-block {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;

  &__title {
    font-size: 30rpx;
    font-weight: 500;
    color: #000;
    display: block;
    margin-bottom: 12rpx;
  }
  &__desc {
    font-size: 26rpx;
    color: #666;
    line-height: 1.7;
    display: block;
    margin-bottom: 16rpx;
  }
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
