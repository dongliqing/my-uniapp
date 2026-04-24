<template>
  <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="custom-nav__bar" :style="{ height: navBarHeight + 'px' }">
      <!-- 左侧返回按钮 -->
      <view class="custom-nav__left" @tap="goBack">
        <image v-if="showBack" class="custom-nav__back-icon" src="/static/images/svg/merchantDetail/7.svg" mode="aspectFit" />
      </view>

      <!-- 标题 -->
      <text v-if="title" class="custom-nav__title">{{ title }}</text>

      <!-- 右侧插槽 -->
      <view class="custom-nav__right">
        <slot name="right" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  showBg?: boolean
  showBack?: boolean
}>(), {
  title: '',
  showBg: true,
  showBack: true
})

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 20
  try {
    const menuBtn = uni.getMenuButtonBoundingClientRect()
    navBarHeight.value = menuBtn.height + (menuBtn.top - statusBarHeight.value) * 2
  } catch {
    navBarHeight.value = 44
  }
})

function goBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  }
}
</script>

<style lang="scss" scoped>
.custom-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;

  &__bar {
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    position: relative;
  }

  &__left {
    position: absolute;
    left: 24rpx;
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__back-icon {
    width: 24rpx;
    height: 24rpx;
  }

  &__title {
    font-size: 34rpx;
    font-weight: 500;
    color: #000;
    flex: 1;
    text-align: center;
  }

  &__right {
    position: absolute;
    right: 24rpx;
    display: flex;
    align-items: center;
    gap: 16rpx;
  }
}
</style>
