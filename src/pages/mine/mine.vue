<template>
  <view class="mine-page">
    <!-- 顶部背景 -->
    <view class="top-gradient">
      <image class="wave-decoration" src="@/static/images/mine-bg.svg" mode="aspectFill" />
    </view>
    <view class="pt-[212rpx] flex items-center px-[36rpx] relative z-[9]">
      <!-- 头像用户名 -->
      <AImage v-if="avatarFileId" class="!w-[120rpx] !h-[120rpx] !rounded-full overflow-hidden" :file-id="avatarFileId" @tap="editAvatar" />
      <image v-else class="w-[120rpx] h-[120rpx] rounded-full" src="@/static/images/avatar.png" mode="aspectFill" @tap="editAvatar" />
      <view class="ml-[24rpx] flex items-center" @tap="editUserName">
        <text class="text-[30rpx] text-[#000] mr-[16rpx] username pb-[4rpx]">{{ username || '未设置用户名' }}</text>
        <uni-icons type="forward" size="34rpx" color="#333" class="" />
      </view>
    </view>
    <view class="mt-[66rpx] rounded-[30rpx_30rpx_0_0] bg-[#f5f5f5] relative z-[9] h-[400rpx] p-[36rpx]">
      <view class="flex items-center" @click="jumpToBusiness">
        <image class="w-[60rpx] h-[60rpx]" src="@/static/images/icon-exchange.svg" mode="aspectFill" />
        <text class="text-[26rpx] text-[#000] ml-[24rpx]">切换商家版</text>
        <uni-icons type="forward" size="32rpx" color="#333" class="ml-auto" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { uploadFileApi } from '@/api/common.ts';
import { saveUserInfo } from '@/api/login.ts';
import AImage from '@/components/AImage.vue';
import { pageInterceptor } from '@/utils/interceptor.ts';

const userInfo = uni.getStorageSync('userInfo');

const username = ref(userInfo.name);
const avatarFileId = ref(userInfo.avatarFileId || '');

const editUserName = () => {
  //弹出一个输入框
  uni.showModal({
    title: '修改用户名',
    // content: '请输入用户名',
    editable: true,
    success: res => {
      // 修改用户名
      // console.log(res);
      username.value = res.content.trim() as string;
      updateUserInfo();
    }
  });
};
const editAvatar = () => {
  // 选择图片
  uni.chooseImage({
    count: 1, // 最多选择几张
    // 仅在 H5 端生效，弹出选择框时只能选中 jpg 和 png 文件
    extension: ['.jpg', '.jpeg', '.png'],
    sizeType: ['compressed'], // 指定是原图还是压缩图
    sourceType: ['camera', 'album'], // 指定来源是相机还是相册
    success: async res => {
      // console.log(res);
      const tempFilePath = res.tempFilePaths[0];
      // const fileName = res.tempFiles[0].name;
      // const type = res.tempFiles[0].type;

      // 上传到服务器
      const fileid = await uploadFileApi(tempFilePath);
      avatarFileId.value = fileid;
      // console.log(fileid, type)
      updateUserInfo();
    }
  });
};

const updateUserInfo = async () => {
  const params = {
    openid: uni.getStorageSync('openid'),
    tyshxydm: userInfo.tyshxydm,
    dysj: userInfo.dysj,
    zhlx: userInfo.isBusiness ? '1' : '0', //类型 1-商家，0-个人
    sjh: userInfo.phone,
    xm: username.value,
    tx: avatarFileId.value
  };
  console.log('params:', params);
  saveUserInfo({ datas: [{ mainTable: params }] }).then(res => {
    if (res.status) {
      userInfo.avatarFileId = avatarFileId.value;
      userInfo.name = username.value;
      uni.setStorageSync('userInfo', userInfo);
    } else {
      uni.showToast({
        title: '更新失败，请刷新重试',
        icon: 'success',
        duration: 1500
      });
    }
  });
};

const jumpToBusiness = () => {
  const url = `https://jysj.syncbase.cn/sp/ebdpage/view/freepass/1268154919057244161?openid=${uni.getStorageSync('openid')}`;
  uni.navigateTo({
    url: '/pages/frame/frame?link=' + encodeURIComponent(url)
  });
};

onShow(() => {
  pageInterceptor('/pages/mine/mine');
});
</script>
<style lang="scss" scoped>
.mine-page {
  min-height: 100vh;
  position: relative;
  background: #f5f5f5;

  .top-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 612rpx;
    z-index: 0;
    .wave-decoration {
      width: 100%;
      height: 100%;
    }
  }
}

.username {
  font-weight: 600;
}
</style>
