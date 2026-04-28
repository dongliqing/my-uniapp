<template>
  <view class="dishes-panel">
    <view v-for="(dish, idx) in dishes" :key="idx" class="dish-card">
      <view class="dish-card__img-wrap">
        <image class="dish-card__img" :src="dish.image" @tap="previewImage(dish.image)" mode="aspectFill" />
      </view>
      <view class="dish-card__info">
        <text class="dish-card__name">{{ dish.name }}</text>
        <text class="dish-card__price">{{ dish.price }}</text>
      </view>
    </view>

    <view v-if="!dishes.length" class="dishes-panel__empty">
      <text>暂无特色菜品</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface DishItem {
  name: string
  price: string
  image: string
}

defineProps<{
  dishes: DishItem[]
}>()

function previewImage(url: string) {
  uni.previewImage({ current: url, urls: [url] })
}
</script>

<style lang="scss" scoped>
.dishes-panel {
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
  padding: 24rpx;
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
