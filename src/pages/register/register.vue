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
      <view v-if="!formData.isBusiness" class="form-item">
        <text>姓名</text>
        <input type="nickname" v-model="formData.name" placeholder="请输入姓名" maxlength="50" />
      </view>
      <view v-else class="form-item">
        <text>对应商家</text>
        <picker mode="selector" :range="pickerOptions" range-key="label" :value="currentIndex" @change="onPickerChange">
          <view class="picker-display">{{ selectedLabel || '请选择' }}</view>
        </picker>
      </view>
      <!-- 注册按钮 -->
      <button class="submit-btn" @click="handleSubmit" :disabled="isLoading">确认注册</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { saveUserInfo, getStorePickerOptions } from '@/api/login.ts';
import { customNavigateTo } from '@/utils/utils.ts';

// 定义选项数据类型
interface PickerOption {
  label: string;
  value: string | number;
  tyshxydm: string; //统一社会信用代码
}

const phone = uni.getStorageSync('phone');
// 表单数据
const formData = reactive({
  phone: phone,
  isBusiness: false,
  name: '',
  tyshxydm: '',
  dysj: ''
});
const isLoading = ref(false);
const redirectUrl = ref('');

// 选项数据源
const pickerOptions = ref<PickerOption[]>([]);

getStorePickerOptions({
  pageInfo: {
    pageNo: '1',
    pageSize: '10'
  }
}).then(res => {
  // console.log('pickerOptions:', res);
  pickerOptions.value = (res.datas || []).map(e => {
    return {
      label: e.mainTable.sjxx,
      value: e.mainTable.id,
      tyshxydm: e.mainTable.tyshxydm
    };
  });
});

// 当前选中的下标
const currentIndex = ref('');

// 计算当前选中的显示文本
const selectedLabel = computed(() => pickerOptions.value[currentIndex.value]?.label);

// 监听选择改变事件
const onPickerChange = (e: any) => {
  currentIndex.value = e.detail.value;
  console.log('选中的值为：', pickerOptions.value[currentIndex.value]);
  const target = pickerOptions.value[currentIndex.value];
  formData.name = target.label;
  formData.dysj = target.value;
  formData.tyshxydm = target.tyshxydm;
};

onLoad(options => {
  // 获取手机号码
  redirectUrl.value = decodeURIComponent(options.redirect || '');
});

const businessChange = e => {
  formData.isBusiness = e.detail.value;
  formData.name = '';
  formData.dysj = '';
  formData.tyshxydm = '';
  console.log('switch1 发生 change 事件，携带值为', e.detail.value);
};

// 登录逻辑
const handleSubmit = () => {
  if (!formData.name) {
    uni.showToast({
      title: formData.isBusiness ? '请选择商家' : '请填写姓名',
      icon: 'none'
    });
    return;
  }

  const params = {
    openid: uni.getStorageSync('openid'),
    tyshxydm: formData.tyshxydm,
    dysj: formData.dysj,
    zhlx: formData.isBusiness ? '1' : '0', // 1-商家，0-个人
    xm: formData.name,
    sjh: phone
  };
  console.log('params:', params);
  // return;
  saveUserInfo({ datas: [{ mainTable: params }] }).then(res => {
    console.log('注册提交', res);
    if (!res.status) {
      uni.showToast({
        title: '提交失败，请重试',
        icon: 'success',
        duration: 1500
      });
    } else {
      const userInfo = {
        // userId: res.dataIds[0] || '',
        phone: phone,
        name: formData.name,
        isBusiness: formData.isBusiness,
        tyshxydm: formData.tyshxydm,
        dysj: formData.dysj,
        avatarFileId: ''
      };
      uni.setStorageSync('userInfo', userInfo);
      if (redirectUrl.value) {
        customNavigateTo(redirectUrl.value);
      } else {
        uni.switchTab({ url: '/pages/index/index' });
      }
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
