<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">登录</text>
    </view>
    <view class="login-area">
      <view class="login-item">
        <text>手机号</text>
        <input type="text" v-model="phone" placeholder="请输入手机号" />
      </view>
      <view class="login-item">
        <text>密码</text>
        <input type="password" v-model="password" placeholder="请输入密码" />
      </view>
    </view>
    <view class="login-btn" @click="handleLogin">
      <text>登录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { useRouter } from 'uni-mini-router';
  import { ref } from 'vue';

  const router = useRouter();
  const phone = ref('');
  const password = ref('');

  const handleLogin = () => {
    // 模拟登录成功
    uni.setStorageSync('user_token', 'bearer_login_success');

    uni.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500,
    });

    // 登录成功后跳转
    setTimeout(() => {
      // 从 query 中获取重定向路径
      const redirect = router.currentRoute.value.query.redirect;
      if (redirect) {
        // 如果 redirect 包含路径，直接跳转
        const targetUrl = (redirect as string).startsWith('/')
          ? (redirect as string)
          : '/' + (redirect as string);
        router.replace({ path: targetUrl });
      } else {
        // 否则跳转到首页
        router.replace({ name: 'home' });
      }
    }, 1600);
  };
</script>

<style scoped lang="scss">
  .login-area {
    margin: 40rpx 0;
  }

  .login-item {
    margin: 20rpx 0;
    padding: 20rpx;
    background: #f5f5f5;
    border-radius: 10rpx;
  }

  .login-item input {
    margin-top: 10rpx;
    padding: 15rpx;
    border: 1rpx solid #ddd;
    border-radius: 8rpx;
    width: 100%;
  }

  .login-btn {
    margin-top: 40rpx;
    padding: 25rpx;
    background: #007aff;
    color: white;
    text-align: center;
    border-radius: 12rpx;
    font-weight: bold;
  }
</style>
