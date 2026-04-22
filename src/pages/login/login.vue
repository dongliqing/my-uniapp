<template>
  <view class="login-container flex flex-col">
    <!-- 背景图 -->
    <image class="bg-image" src="/static/images/login_bg.png" mode="cover" />

    <view class="mt-[100px] ml-[15px]">
      <view class="text-[20px] mb-[4px]">欢迎使用</view>
      <text class="text-[16px]">缙云餐饮综合管理平台</text>
    </view>

    <!-- 登录内容区域 -->
    <view class="login-form flex-1 pt-[10px]">
      <view class="form-item">
        <text>手机号码</text>
        <input type="tel" v-model="formData.phone" placeholder="请获取" maxlength="11" disabled />
        <button
          v-if="!formData.phone"
          class="get-phone-btn"
          open-type="getPhoneNumber"
          @getphonenumber="handleGetPhone"
        >
          点击获取
        </button>
      </view>
      <view class="form-item">
        <text>是否商家</text>
        <switch
          name="isBusiness"
          :checked="formData.isBusiness"
          class="ml-[15px]"
          style="transform: scale(0.9)"
          @change="businessChange"
        />
      </view>
      <view class="form-item">
        <text>{{ nameLabel }}</text>
        <input
          type="text"
          v-model="formData.name"
          :placeholder="`请输入${nameLabel}`"
          maxlength="50"
        />
      </view>
      <!-- 登录按钮 -->
      <button class="login-btn" @click="handleLogin" :disabled="isLoading"> 登录 </button>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { useRouter } from 'uni-mini-router';
  import { appId, appSecret } from '@/pages/constant/constant';

  const router = useRouter();

  // 表单数据
  const formData = reactive({
    phone: '',
    isBusiness: false,
    name: '',
  });
  const isLoading = ref(false);
  const nameLabel = computed(() => (formData.isBusiness ? '商家名称' : '用户名称'));

  const businessChange = (e) => {
    formData.isBusiness = e.detail.value;
    console.log('switch1 发生 change 事件，携带值为', e.detail.value);
  };
  const getOpenid = async () => {
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
      data: { code: code },
    });

    // 3. 接收后端返回的 openid
    const { openid } = requestRes.data;
    console.log('获取到的 openid:', openid);
    uni.setStorageSync('openid', openid);
    // uni.showToast({ title: '获取成功', icon: 'success' });
  };
  getOpenid();
  const getAccessToken = async () => {
    const requestRes = await uni.request({
      url: `https://api.weixin.qq.com/cgi-bin/token?appid=${appId}&secret=${appSecret}&grant_type=client_credential`,
      method: 'GET',
    });
    const { access_token, expires_in } = requestRes.data;
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
      uni.showToast({ title: '用户拒绝授权', icon: 'none' });
      return;
    }

    //缓存中获取access_token
    //判断是否过期
    const expiresIn = uni.getStorageSync('access_token_expires_in');
    if (!expiresIn || expiresIn <= Date.now()) {
      // 获取新的 access_token
      await getAccessToken();
    }
    const sessionToken = uni.getStorageSync('access_token');
    uni.request({
      url: 'https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=' + sessionToken,
      method: 'POST',
      data: {
        code: e.detail.code, // 登录凭证
      },
      success: (res) => {
        if (res.data.errcode === 0) {
          const { phoneNumber } = res.data.phone_info;
          formData.phone = phoneNumber;
          // uni.showToast({ title: `手机号: ${phoneNumber}`, icon: 'success' });
          // 这里可以进行后续的登录或绑定操作
          console.log('phoneNumber：', phoneNumber);
        } else {
          uni.showToast({ title: '获取失败', icon: 'none' });
        }
      },
    });
  }

  // 登录逻辑
  const handleLogin = () => {
    if (!formData.phone) {
      uni.showToast({
        title: '请获取手机号',
        icon: 'none',
      });
      return;
    }
    if (!formData.name) {
      uni.showToast({
        title: '请填写' + nameLabel.value,
        icon: 'none',
      });
      return;
    }

    // 模拟登录成功
    uni.setStorageSync('user_token', 'bearer_login_success');

    uni.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500,
    });

    // 登录成功后跳转
    setTimeout(() => {
      const redirect = router.currentRoute.value.query.redirect;
      if (redirect) {
        const targetUrl = redirect.startsWith('/') ? redirect : '/' + redirect;
        router.replace({ path: targetUrl });
      } else {
        router.replace({ name: 'home' });
      }
    }, 1600);
  };
</script>

<style scoped lang="scss">
  .login-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .bg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60%;
    z-index: -1;
  }

  .login-form {
    // padding: 40rpx;
    color: #333;
    background: #ffffff;
    border-radius: 20rpx;
    margin: auto;
    margin-top: 40rpx;
    width: 92%;

    .form-item {
      display: flex;
      align-items: center;
      margin: 0 40rpx;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #e3e3e3;
      input {
        flex: 1;
        margin-left: 26rpx;
        font-size: 32rpx;
        padding: 10rpx 0;
      }
    }

    .get-phone-btn {
      width: 160rpx !important;
      // height: 48rpx !important;
      color: #46b2ff !important;
      background: none !important;
      font-size: 32rpx;
      margin: 0 0 0 26rpx !important;
      padding: 0 !important;
      border: 0 !important;
      line-height: 60rpx;
      &::after {
        border: none;
      }
    }
    .login-btn {
      padding: 2rpx 0;
      background: #1882fc;
      color: white;
      font-size: 32rpx;
      border-radius: 100rpx;
      margin: 80rpx 40rpx 0;
      letter-spacing: 8rpx;
    }
  }
</style>
