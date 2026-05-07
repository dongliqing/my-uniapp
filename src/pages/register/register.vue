<template>
  <view class="login-container pt-[30rpx]">
    <!-- 登录内容区域 -->
    <view class="login-form">
      <view class="title flex flex-col items-center pt-[70rpx] pb-[40rpx]">
        <view class="text-[#000] text-[40rpx]" style="font-weight: 600">用户注册</view>
        <view class="text-[26rpx] text-[#999] pt-[4rpx]">请完善您的基本信息</view>
      </view>
      <view class="form-item">
        <text>手机号码</text>
        <input type="tel" v-model="formData.phone" placeholder="" maxlength="11" disabled class="disabled" />
      </view>
      <view class="form-item">
        <text>是否商家</text>
        <switch name="isBusiness" :checked="formData.isBusiness" style="transform: scale(0.9)" @change="businessChange" />
      </view>
      <view class="form-item">
        <text>{{ nameLabel }}</text>
        <input type="text" v-model="formData.name" :placeholder="`请输入${nameLabel}`" maxlength="50" />
      </view>
      <!-- 注册按钮 -->
      <button class="submit-btn" @click="handleSubmit" :disabled="isLoading">确认注册</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { appId, appSecret } from '@/pages/constant/constant'

// 表单数据
const formData = reactive({
  phone: '17788889999',
  isBusiness: false,
  name: ''
})
const isLoading = ref(false)
const nameLabel = computed(() => (formData.isBusiness ? '商家名称' : '姓名'))

const businessChange = e => {
  formData.isBusiness = e.detail.value
  console.log('switch1 发生 change 事件，携带值为', e.detail.value)
}
const getOpenid = async () => {
  const loginRes = await uni.login({ provider: 'weixin' })
  console.log('loginRes', loginRes)
  if (loginRes.errMsg !== 'login:ok') {
    uni.showToast({ title: '登录失败', icon: 'none' })
    return
  }
  const code = loginRes.code
  console.log('获取到的 code:', code)
  const requestRes = await uni.request({
    url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&grant_type=authorization_code`,
    method: 'GET',
    data: { code: code }
  })

  // 3. 接收后端返回的 openid
  const { openid } = requestRes.data
  console.log('获取到的 openid:', openid)
  uni.setStorageSync('openid', openid)
  // uni.showToast({ title: '获取成功', icon: 'success' });
}
// getOpenid()

const getAccessToken = async () => {
  const requestRes = await uni.request({
    url: `https://api.weixin.qq.com/cgi-bin/token?appid=${appId}&secret=${appSecret}&grant_type=client_credential`,
    method: 'GET'
  })
  const { access_token, expires_in } = requestRes.data
  //缓存access_token到本地
  uni.setStorageSync('access_token', access_token)
  const currentTime = Date.now() //获取当前时间戳
  const expiresIn = currentTime + expires_in * 1000
  uni.setStorageSync('access_token_expires_in', expiresIn)
  console.log('获取到的 access_token:', access_token)
  console.log('获取到的 expires_in:', expiresIn)
}
// getAccessToken();

// 登录逻辑
const handleSubmit = () => {
  if (!formData.phone) {
    uni.showToast({
      title: '请获取手机号',
      icon: 'none'
    })
    return
  }
  if (!formData.name) {
    uni.showToast({
      title: '请填写' + nameLabel.value,
      icon: 'none'
    })
    return
  }

  // 模拟登录成功
  uni.setStorageSync('user_token', 'bearer_login_success')

  uni.showToast({
    title: '登录成功',
    icon: 'success',
    duration: 1500
  })

  // 登录成功后跳转
  // setTimeout(() => {
  //   const redirect = router.currentRoute.value.query.redirect;
  //   if (redirect) {
  //     const targetUrl = redirect.startsWith('/') ? redirect : '/' + redirect;
  //     router.replace({ path: targetUrl });
  //   } else {
  //     router.replace({ name: 'home' });
  //   }
  // }, 1600);
}
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  width: 100%;
  min-height: calc(100vh - var(--status-bar-height) - var(--window-top) - var(--window-bottom));
  background-color: #f5f5f5;
  box-sizing: border-box;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  z-index: -1;
  filter: hue-rotate(165deg);
}

.login-form {
  color: #333;
  background: #ffffff;
  border-radius: 20rpx;
  margin: auto;
  width: 92%;
  padding-bottom: 100rpx;

  .form-item {
    display: flex;
    align-items: center;
    margin: 0 40rpx;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #e3e3e3;
    text {
      width: 130rpx;
      text-align-last: justify;
      margin-right: 48rpx;
    }
    input {
      flex: 1;
      font-size: 32rpx;
      padding: 10rpx 0;
      &.disabled {
        color: #999;
      }
    }
  }

  .get-phone-btn {
    width: 160rpx !important;
    color: #1882fc !important;
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
  .submit-btn {
    padding: 2rpx 0;
    background: #1882fc;
    color: white;
    font-size: 32rpx;
    border-radius: 100rpx;
    margin: 80rpx 40rpx 0;
    letter-spacing: 4rpx;
  }
}
</style>
