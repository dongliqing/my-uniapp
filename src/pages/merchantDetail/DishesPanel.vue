<template>
  <scroll-view class="dishes-panel" scroll-y :scroll-top="scrollTop" @scrolltolower="loadMore"
    style="height: calc(100vh - 500rpx)">
    <view class="dishes-panel__inner">
      <view v-for="(dish, idx) in dishes" :key="idx" class="dish-card" @tap="previewImage(dish.image)">
        <view class="dish-card__img-wrap">
          <image class="dish-card__img" :src="dish.image" mode="aspectFill" />
        </view>
        <view class="dish-card__info">
          <text class="dish-card__name">{{ dish.name }}</text>
          <text class="dish-card__price">{{ dish.price }}</text>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="dishes-panel__loading">
        <text>加载中...</text>
      </view>
      <view v-else-if="noMore && dishes.length > 0" class="dishes-panel__nomore">
        <text>— 没有更多了 —</text>
      </view>
      <view v-if="dishes.length === 0 && !loading" class="dishes-panel__empty">
        <text>暂无特色菜品</text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface DishItem {
  name: string
  price: string
  image: string
}

const props = defineProps<{
  dishes: DishItem[]
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

function previewImage(url: string) {
  uni.previewImage({ current: url, urls: [url] })
}
</script>

<style lang="scss" scoped>
.dishes-panel {
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

.dish-card {
  display: flex;
  gap: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 16rpx;
  margin-bottom: 20rpx;

  &__img-wrap {
    width: 228rpx;
    height: 198rpx;
    border-radius: 10rpx;
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8rpx 0;
  }

  &__name {
    font-size: 28rpx;
    color: #000;
  }

  &__price {
    font-size: 28rpx;
    color: #000;
  }
}
</style>
