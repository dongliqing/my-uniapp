<template>
  <view class="login-container flex items-center">
    <!-- 登录内容区域 -->
    <view class="login-form pt-[40rpx] pb-[50rpx] flex flex-col items-center">
      <text style="font-weight: 600" class="text-[34rpx]">欢迎使用本系统</text>
      <text class="text-[#666] text-[26rpx] py-[8rpx]">快速登录，轻松使用</text>
      <button class="login-btn" @click="handleGetPhone" :disabled="isLoading">手机号快捷登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { appId, appSecret } from '@/pages/constant/constant';
import { getUserInfo } from '@/api/login.ts';
import { customNavigateTo } from '@/utils/utils.ts';

const redirectUrl = ref('');

onLoad(options => {
  // 从 options 中解构或直接获取参数
  redirectUrl.value = decodeURIComponent(options.redirect || '');
  // console.log('接收到的redirectUrl：', redirectUrl.value);
  getOpenid();
});

// 表单数据
const formData = reactive({
  phone: '',
  isBusiness: false,
  name: ''
});
const isLoading = ref(false);

const getOpenid = async () => {
  uni.setStorageSync('openid', '1234567890');
  // uni.setStorageSync('openid', '9234567890');
  return;
  const loginRes = await uni.login({ provider: 'weixin' });
  console.log('loginRes', loginRes);
  if (loginRes.errMsg !== 'login:ok') {
    uni.showToast({ title: '登录失败', icon: 'none' });
    return;
  }
  const code = loginRes.code;
  console.log('获取到的 code:', code);
  const requestRes = await uni.request({
    url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&grant_type=authorization_code`,
    method: 'GET',
    data: { code: code }
  });
  console.log('requestRes', requestRes);
  // 3. 接收后端返回的 openid
  const { openid } = requestRes.data as { openid: string };
  console.log('获取到的 openid:', openid);
  uni.setStorageSync('openid', openid);
};
// getOpenid();

const getAccessToken = async () => {
  const requestRes = await uni.request({
    url: `https://api.weixin.qq.com/cgi-bin/token?appid=${appId}&secret=${appSecret}&grant_type=client_credential`,
    method: 'GET'
  });
  const { access_token, expires_in } = requestRes.data as { access_token: string; expires_in: number };
  //缓存access_token到本地
  uni.setStorageSync('access_token', access_token);
  const currentTime = Date.now(); //获取当前时间戳
  const expiresIn = currentTime + expires_in * 1000;
  uni.setStorageSync('access_token_expires_in', expiresIn);
  console.log('获取到的 access_token:', access_token);
  console.log('获取到的 expires_in:', expiresIn);
};
// getAccessToken();

async function handleGetPhone(e) {
  console.log('e.detail', e.detail);
  // 2. 检查用户是否同意授权
  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    // uni.showToast({ title: '用户拒绝授权', icon: 'none' });
    // return;
  }

  uni.setStorageSync('phone', '19900009999');
  // uni.setStorageSync('phone', '19900007777');

  getUserLoginInfo();

  // await getAccessToken();
  // const sessionToken = uni.getStorageSync('access_token');
  // uni.request({
  //   url: 'https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=' + sessionToken,
  //   method: 'POST',
  //   data: {
  //     code: e.detail.code // 登录凭证
  //   },
  //   success: res => {
  //     if (res.data.errcode === 0) {
  //       const { phoneNumber } = res.data.phone_info;
  //       formData.phone = phoneNumber;
  //       // uni.showToast({ title: `手机号: ${phoneNumber}`, icon: 'success' });
  //       // 这里可以进行后续的登录或绑定操作
  //       console.log('phoneNumber：', phoneNumber);
  //       //登录
  //       uni.setStorageSync('phone', phoneNumber);
  //     } else {
  //       uni.showToast({ title: '获取失败', icon: 'none' });
  //     }
  //   }
  // });
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

    if (!result) {
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
        dysj: result.dysj
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
