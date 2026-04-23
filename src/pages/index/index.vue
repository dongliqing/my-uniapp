<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title !text-[red]" @click="handleClick">{{ title }}</text>
      <text class="title !text-[red]" @click="handleLogin">去登陆</text>
      <text @tap="goMerchant">去商户列表</text>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { useRouter } from 'uni-mini-router';

  const title = ref('Hello');
  const router = useRouter();

  // 点击title跳转到商家列表页
  const handleClick = () => {
    router.push({
      name: 'storeList',
    });
  };
  const handleLogin = () => {
    router.push({
      name: 'login',
    });
  };

const goMerchant = (item: any) => {
  uni.navigateTo({ url: `/pages/merchantList/index?id=${item.id}` })
}
</script>

<style scoped>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
  }

  .text-area {
    display: flex;
    justify-content: center;
  }

  .title {
    font-size: 36rpx;
    color: #8f8f94;
  }
</style>
