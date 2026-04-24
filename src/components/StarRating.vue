<template>
  <view class="star-rating">
    <view v-for="i in 5" :key="i" class="star-rating__item">
      <image
        :src="getStarIcon(i)"
        class="star-rating__icon"
        :style="{ width: `${size}rpx`, height: `${size}rpx` }"
        mode="aspectFill"
      />
    </view>
    <text v-if="showScore" class="star-rating__score">{{ score }}</text>
  </view>
</template>

<script setup lang="ts">
  interface Props {
    score: number   // 原始评分（100分制）
    size?: number   // 图标大小（rpx）
    showScore?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    score: 0,
    size: 28,
    showScore: true,
  })

  // 将 100 分制转为 5 星制
  const starsValue = (props.score / 100) * 5

  function getStarIcon(index: number): string {
    if (index <= Math.floor(starsValue)) {
      return '/static/icons/star-full.png'
    } else if (index - starsValue < 1 && starsValue % 1 >= 0.5) {
      return '/static/icons/star-half.png'
    } else {
      return '/static/icons/star-empty.png'
    }
  }
</script>

<style lang="scss" scoped>
  .star-rating {
    display: flex;
    align-items: center;
    gap: 4rpx;

    &__item {
      display: flex;
      align-items: center;
    }

    &__icon {
      display: block;
    }

    &__score {
      margin-left: 8rpx;
      font-size: $font-sm;
      color: $text-regular;
      font-weight: 500;
    }
  }
</style>
