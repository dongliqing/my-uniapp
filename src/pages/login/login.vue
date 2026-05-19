<template>
  <view class="login-container flex items-center">
    <!-- 登录内容区域 -->
    <view class="login-form pt-[40rpx] pb-[50rpx] flex flex-col items-center">
      <text style="font-weight: 600" class="text-[34rpx]">欢迎使用本系统</text>
      <text class="text-[#666] text-[26rpx] py-[8rpx]">快速登录，轻松使用</text>
      <button class="login-btn" open-type="getPhoneNumber" @getphonenumber="handleGetPhone" :disabled="isLoading">手机号快捷登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getUserInfo, getWxOpenid, getWxPhone } from '@/api/login.ts';
import { customNavigateTo } from '@/utils/utils.ts';

const isTestMode = true;
const redirectUrl = ref('');

onLoad(options => {
  // 从 options 中解构或直接获取参数
  redirectUrl.value = decodeURIComponent(options.redirect || '');
  // console.log('接收到的redirectUrl：', redirectUrl.value);
});

// 表单数据
const formData = reactive({
  phone: '',
  isBusiness: false,
  name: ''
});
const isLoading = ref(false);

const getOpenid = async () => {
  // uni.setStorageSync('openid', '1234567890');
  // uni.setStorageSync('openid', '9234567890');
  // return;
  const loginRes = await uni.login({ provider: 'weixin' });
  console.log('loginRes', loginRes);
  if (loginRes.errMsg !== 'login:ok') {
    uni.showToast({ title: '登录失败', icon: 'none' });
    return;
  }
  const code = loginRes.code;
  console.log('获取到的 code:', code);
  const requestRes = await getWxOpenid({ code: code });
  console.log('requestRes', requestRes);
  // 3. 接收后端返回的 openid
  const { openid } = requestRes as { openid: string };
  console.log('获取到的 openid:', openid);
  if (isTestMode) {
    uni.setStorageSync('openid', 'abcdefgggg');
  } else {
    uni.setStorageSync('openid', openid);
  }
};
getOpenid();

async function handleGetPhone(e) {
  if (isTestMode) {
    uni.setStorageSync('phone', '19900007777');
    getUserLoginInfo();
    return;
  }
  console.log('e.detail', e.detail);
  // 2. 检查用户是否同意授权
  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({ title: '用户拒绝授权', icon: 'none' });
    return;
  }

  const res = await getWxPhone({
    code: e.detail.code
  });
  const phoneNumber = res?.phoneInfo?.phoneNumber;
  if (phoneNumber) {
    uni.setStorageSync('phone', phoneNumber);
    getUserLoginInfo();
  } else {
    uni.showToast({ title: '获取失败', icon: 'none' });
  }
}

// 登录逻辑
const getUserLoginInfo = async () => {
  const openid = uni.getStorageSync('openid');
  getUserInfo({
    mainTable: {
      openid: openid
    }
  }).then(res => {
    console.log('查询用户信息', res);
    const result = res?.datas?.[0]?.mainTable;

    if (isTestMode || !result) {
      // 用户不存在，跳转到注册页面
      if (redirectUrl.value) {
        uni.navigateTo({ url: '/pages/register/register?redirect=' + encodeURIComponent(redirectUrl.value) });
      } else {
        uni.navigateTo({ url: '/pages/register/register' });
      }
    } else {
      //跳转到首页
      const userInfo = {
        phone: result.sjh,
        name: result.xm,
        isBusiness: result.zhlx === '1',
        tyshxydm: result.tyshxydm,
        dysj: result.dysj,
        avatarFileId: result.tx || ''
      };
      uni.setStorageSync('userInfo', userInfo);
      customNavigateTo(redirectUrl.value);
    }
  });
};
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  width: 100%;
  min-height: calc(100vh - var(--status-bar-height) - var(--window-top) - var(--window-bottom));
  background-color: #f5f5f5;
  box-sizing: border-box;
}

.login-form {
  // padding: 40rpx;
  color: #333;
  background: #ffffff;
  border-radius: 20rpx;
  margin: auto;
  width: 92%;
  .login-btn {
    // padding: 2rpx 0;
    background: linear-gradient(237deg, #1782fc 0%, #46b2ff 100%);
    color: white;
    font-size: 28rpx;
    border-radius: 100rpx;
    margin: 40rpx 0 0;
    width: 90%;
    letter-spacing: 2rpx;
  }
}
</style>
