<template>
  <view class="complaint">
    <!-- 主滚动区 -->
    <scroll-view class="complaint__scroll" scroll-y>
      <view class="complaint__content">
        <!-- 商家信息卡 -->
        <view class="complaint__section">
          <text class="complaint__section-title">商家信息</text>
          <view class="complaint__info-row">
            <text class="complaint__info-label">商家名称：</text>
            <text class="complaint__info-value">{{ merchantInfo?.sjxx ?? '--' }}</text>
          </view>
          <view class="complaint__info-row">
            <text class="complaint__info-label">商家地址：</text>
            <text class="complaint__info-value">{{ merchantInfo?.sjdz ?? '--' }}</text>
          </view>
        </view>

        <!-- 投诉内容 -->
        <view class="complaint__section">
          <text class="complaint__section-title">投诉信息</text>
          <textarea
            v-model="form.tsnr"
            class="complaint__textarea"
            placeholder="请详细描述投诉内容，我们会保密该信息~"
            placeholder-class="complaint__textarea-placeholder"
            :maxlength="500"
          />

          <!-- 图片上传 -->
          <view class="complaint__upload-area">
            <view class="complaint__upload-list">
              <!-- 已上传图片 -->
              <view v-for="(img, i) in previewImgs" :key="i" class="complaint__upload-preview" @tap="previewImage(i)">
                <image class="complaint__upload-preview-img" :src="img" mode="aspectFill" />
                <view class="complaint__upload-del" @tap.stop="removeImage(i)">×</view>
              </view>
              <!-- 上传按钮（未满4张时显示） -->
              <view v-if="form.tp.length < 4" class="complaint__upload-btn" @tap="chooseImage">
                <image class="complaint__upload-icon" src="/static/images/svg/upload.svg" mode="aspectFit" />
                <text class="complaint__upload-hint-text">图片({{ form.tp.length }}/4)</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 联系方式 -->
        <view class="complaint__section">
          <text class="complaint__section-title">联系方式</text>
          <text class="complaint__contact-hint">联系方式用于执法人员联系本人了解具体投诉内容，绝不外泄</text>
          <input v-model="form.tsrlxfs" class="complaint__input" type="number" placeholder="欢迎留下你的手机号" placeholder-class="complaint__input-placeholder" :maxlength="11" />
        </view>

        <!-- 间距 -->
        <view style="height: 160rpx" />
      </view>
    </scroll-view>

    <!-- 提交按钮 -->
    <view class="complaint__submit-bar">
      <view class="complaint__submit-btn" :class="{ 'complaint__submit-btn--active': canSubmit }" @tap="submit">
        <text class="complaint__submit-text">提交</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { addComplaint, getMerchantDetail } from '@/api/merchant'
import { getFileApi, uploadFileApi } from '@/api/common'

const pageId = ref('')

const form = reactive({
  tsnr: '',
  tsrlxfs: '',
  tp: [] as string[]
})

const previewImgs = ref<string[]>([])
const merchantInfo = ref<any>(null)

onLoad(options => {
  if (options?.id) {
    pageId.value = options.id
    getMerchantDetail(pageId.value).then((res: any) => {
      console.log(res)
      merchantInfo.value = res.datas[0].mainTable
    })
  }
})

const canSubmit = computed(() => form.tsnr.trim().length > 0 && form.tsrlxfs.trim().length > 0)

function chooseImage() {
  if (form.tp.length >= 4) {
    uni.showToast({ title: '最多上传4张图片', icon: 'none' })
    return
  }
  uni.chooseImage({
    count: 4 - form.tp.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async function (res) {
      const files: any[] = Array.isArray(res.tempFiles) ? res.tempFiles : [res.tempFiles]

      for (const file of files) {
        try {
          // 上传到服务器，获取文件ID
          const fileid: any = await uploadFileApi(file.path, file.name)
          // 获取图片资源URL（base64）
          previewImgs.value.push(file.path)

          form.tp.push(fileid)
        } catch (e) {
          console.error('图片上传失败:', e)
        }
      }
    }
  })
}

function removeImage(index: number) {
  form.tp.splice(index, 1)
  previewImgs.value.splice(index, 1)
}

function previewImage(index: number) {
  uni.previewImage({
    current: form.tp[index],
    urls: form.tp
  })
}

/** 格式化日期为 yyyy-MM-dd HH:mm */
function formatDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

async function submit() {
  if (!canSubmit.value) {
    uni.showToast({ title: '请填写投诉信息', icon: 'none' })
    return
  }
  if (!pageId.value) {
    uni.showToast({ title: '页面参数缺失', icon: 'none' })
    return
  }
  if (form.tsrlxfs && !/^1[3-9]\d{9}$/.test(form.tsrlxfs)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  try {
    let res: any = await addComplaint({
      datas: [
        {
          mainTable: { sjmc: merchantInfo.value.id, tsnr: form.tsnr, tsrlxfs: form.tsrlxfs, tp: form.tp.join(','), tssj: formatDate(new Date()) }
        }
      ]
    })
    if (res.status) {
      uni.showToast({ title: '提交成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1500)
    } else {
      uni.showToast({ title: '提交失败，请重试', icon: 'none' })
    }
  } catch (e) {
    uni.showToast({ title: '提交失败，请重试', icon: 'none' })
  }
}
</script>

<style lang="scss">
.complaint {
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;

  &__hero-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 612rpx;
    background: linear-gradient(180deg, #c3e9ff 0%, rgba(195, 233, 255, 0) 100%);
    z-index: 0;
    pointer-events: none;
  }

  &__hero-deco {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    opacity: 0.6;
    pointer-events: none;
  }

  &__nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
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

  &__nav-back-icon {
    width: 24rpx;
    height: 24rpx;
  }

  &__nav-title {
    font-size: 34rpx;
    font-weight: 500;
    color: #000;
  }

  &__scroll {
    position: relative;
    z-index: 2;
  }

  &__content {
    padding: 24rpx;
  }

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

  &__info-label {
    font-size: 24rpx;
    color: #333;
    white-space: nowrap;
    flex-shrink: 0;
  }

  &__info-value {
    font-size: 24rpx;
    color: #333;
    flex: 1;
    line-height: 1.5;
  }

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

  &__textarea-placeholder {
    color: #999;
    font-size: 26rpx;
  }

  /* 图片上传 */
  &__upload-area {
    margin-top: 24rpx;
  }

  &__upload-hint-text {
    font-size: 24rpx;
    color: #666;
    display: block;
    margin-bottom: 12rpx;
  }

  &__upload-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16rpx;
  }

  &__upload-btn {
    aspect-ratio: 1;
    background: #f0f0f0;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__upload-icon {
    width: 68rpx;
    height: 68rpx;
  }

  &__upload-preview {
    aspect-ratio: 1;
    position: relative;
    border-radius: 10rpx;
    overflow: hidden;
  }

  &__upload-preview-img {
    width: 100%;
    height: 100%;
  }

  &__upload-del {
    position: absolute;
    top: 4rpx;
    right: 4rpx;
    width: 36rpx;
    height: 36rpx;
    background: rgba(0, 0, 0, 0.5);
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
    background: #f0f0f0;
    border-radius: 10rpx;
    padding: 0 16rpx;
    font-size: 24rpx;
    color: #333;
    box-sizing: border-box;
  }

  &__input-placeholder {
    color: #999;
    font-size: 24rpx;
  }

  /* 提交栏 */
  &__submit-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;
    padding: 24rpx 36rpx;
    padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
    z-index: 999;
  }

  &__submit-btn {
    width: 100%;
    height: 78rpx;
    border-radius: 51rpx;
    background: #1882fc;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;

    &--active {
      opacity: 1;
    }
  }

  &__submit-text {
    font-size: 32rpx;
    color: #fff;
    letter-spacing: 6rpx;
  }
}
</style>
