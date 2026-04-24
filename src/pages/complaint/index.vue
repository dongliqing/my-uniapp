<template>
  <view class="complaint">
    <!-- 渐变背景 -->
    <view class="complaint__hero-bg" />
    <image class="complaint__hero-deco" src="/static/complaint/1.svg" mode="widthFix" />

    <!-- 顶部导航 -->
    <CustomNav title="投诉" :showBg="false" />

    <!-- 主滚动区 -->
    <scroll-view class="complaint__scroll" scroll-y :style="{ paddingTop: statusBarHeight + navBarHeight + 'px' }">
      <view class="complaint__content">
        <!-- 商家信息卡 -->
        <view class="complaint__section">
          <text class="complaint__section-title">商家信息</text>
          <view class="complaint__info-row">
            <text class="complaint__info-label">商家名称：</text>
            <text class="complaint__info-value">缙云烧饼东门老字号烧饼鹿园巷店(胜利街店)</text>
          </view>
          <view class="complaint__info-row">
            <text class="complaint__info-label">商家地址：</text>
            <text class="complaint__info-value">缙云县鹿园巷1号</text>
          </view>
        </view>

        <!-- 投诉内容 -->
        <view class="complaint__section">
          <text class="complaint__section-title">投诉信息</text>
          <textarea
            v-model="complaintContent"
            class="complaint__textarea"
            placeholder="请详细描述投诉内容，我们会保密该信息~"
            placeholder-class="complaint__textarea-placeholder"
            :maxlength="500"
          />

          <!-- 图片上传 -->
          <view class="complaint__upload-area">
            <view class="complaint__upload-hint">
              <text class="complaint__upload-hint-text">图片({{ uploadedImages.length }}/4)</text>
            </view>
            <view class="complaint__upload-btn" @tap="chooseImage">
              <view class="complaint__upload-icon-wrap">
                <image class="complaint__upload-icon" src="/static/complaint/9.svg" mode="aspectFit" />
              </view>
              <view v-for="(img, i) in uploadedImages" :key="i" class="complaint__upload-preview">
                <image class="complaint__upload-preview-img" :src="img" mode="aspectFill" />
                <view class="complaint__upload-del" @tap.stop="removeImage(i)">×</view>
              </view>
            </view>
          </view>
        </view>

        <!-- 联系方式 -->
        <view class="complaint__section">
          <text class="complaint__section-title">联系方式</text>
          <text class="complaint__contact-hint">联系方式用于执法人员联系本人了解具体投诉内容，绝不外泄</text>
          <input
            v-model="phone"
            class="complaint__input"
            type="number"
            placeholder="欢迎留下你的手机号"
            placeholder-class="complaint__input-placeholder"
            :maxlength="11"
          />
        </view>

        <!-- 间距 -->
        <view style="height: 160rpx;" />
      </view>
    </scroll-view>

    <!-- 提交按钮 -->
    <view class="complaint__submit-bar">
      <view
        class="complaint__submit-btn"
        :class="{ 'complaint__submit-btn--active': canSubmit }"
        @tap="submit"
      >
        <text class="complaint__submit-text">提交</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CustomNav from '@/components/CustomNav.vue'

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

const complaintContent = ref('')
const phone = ref('')
const uploadedImages = ref<string[]>([])

const canSubmit = computed(() => complaintContent.value.trim().length > 0)

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

function chooseImage() {
  if (uploadedImages.value.length >= 4) {
    uni.showToast({ title: '最多上传4张图片', icon: 'none' })
    return
  }
  uni.chooseImage({
    count: 4 - uploadedImages.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      uploadedImages.value.push(...res.tempFilePaths)
    }
  })
}

function removeImage(index: number) {
  uploadedImages.value.splice(index, 1)
}

function submit() {
  if (!canSubmit.value) {
    uni.showToast({ title: '请填写投诉内容', icon: 'none' })
    return
  }
  uni.showToast({ title: '提交成功', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1500)
}
</script>

<style lang="scss">
.complaint {
  min-height: 100vh;
  background: #F5F5F5;
  position: relative;

  &__hero-bg {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 612rpx;
    background: linear-gradient(180deg, #C3E9FF 0%, rgba(195,233,255,0) 100%);
    z-index: 0;
    pointer-events: none;
  }
  &__hero-deco {
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    z-index: 1;
    opacity: 0.6;
    pointer-events: none;
  }

  &__nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    background: transparent;
  }
  &__nav-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24rpx;
    position: relative;
  }
  &__nav-back {
    position: absolute;
    left: 24rpx;
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__nav-back-icon { width: 24rpx; height: 24rpx; }
  &__nav-title {
    font-size: 34rpx;
    font-weight: 500;
    color: #000;
  }

  &__scroll { position: relative; z-index: 2; }

  &__content { padding: 24rpx; }

  &__section {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
  }
  &__section-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #000;
    display: block;
    margin-bottom: 24rpx;
  }

  /* 商家信息 */
  &__info-row {
    display: flex;
    align-items: flex-start;
    gap: 8rpx;
    margin-bottom: 16rpx;
  }
  &__info-label { font-size: 24rpx; color: #333; white-space: nowrap; flex-shrink: 0; }
  &__info-value { font-size: 24rpx; color: #333; flex: 1; line-height: 1.5; }

  /* 投诉内容 */
  &__textarea {
    width: 100%;
    min-height: 240rpx;
    font-size: 26rpx;
    color: #333;
    background: transparent;
    line-height: 1.6;
    padding: 0;
    box-sizing: border-box;
  }
  &__textarea-placeholder { color: #999; font-size: 26rpx; }

  /* 图片上传 */
  &__upload-area { margin-top: 24rpx; }
  &__upload-hint { margin-bottom: 12rpx; }
  &__upload-hint-text { font-size: 24rpx; color: #666; }
  &__upload-btn {
    display: flex;
    gap: 16rpx;
    flex-wrap: wrap;
    align-items: center;
  }
  &__upload-icon-wrap {
    width: 152rpx;
    height: 152rpx;
    background: #F0F0F0;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__upload-icon { width: 68rpx; height: 68rpx; }
  &__upload-preview {
    width: 152rpx;
    height: 152rpx;
    position: relative;
    border-radius: 10rpx;
    overflow: hidden;
  }
  &__upload-preview-img { width: 100%; height: 100%; }
  &__upload-del {
    position: absolute;
    top: 4rpx;
    right: 4rpx;
    width: 36rpx;
    height: 36rpx;
    background: rgba(0,0,0,0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #fff;
    line-height: 1;
  }

  /* 联系方式 */
  &__contact-hint {
    font-size: 24rpx;
    color: #666;
    display: block;
    margin-bottom: 24rpx;
    line-height: 1.5;
  }
  &__input {
    width: 100%;
    height: 62rpx;
    background: #F0F0F0;
    border-radius: 10rpx;
    padding: 0 16rpx;
    font-size: 24rpx;
    color: #333;
    box-sizing: border-box;
  }
  &__input-placeholder { color: #999; font-size: 24rpx; }

  /* 提交栏 */
  &__submit-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: transparent;
    padding: 24rpx 36rpx;
    padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
    z-index: 999;
  }
  &__submit-btn {
    width: 100%;
    height: 78rpx;
    border-radius: 51rpx;
    background: #1882FC;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
    &--active { opacity: 1; }
  }
  &__submit-text {
    font-size: 32rpx;
    color: #fff;
    letter-spacing: 6rpx;
  }
}
</style>
