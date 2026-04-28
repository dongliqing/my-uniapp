<template>
  <view class="review">
    <!-- 主滚动区 -->
    <scroll-view class="review__scroll" scroll-y>
      <view class="review__content">
        <!-- 星级评分 -->
        <view class="review__rating">
          <text class="review__rating-label">菜品味道</text>
          <view class="review__stars">
            <image
              v-for="n in 5"
              :key="n"
              class="review__star"
              :src="n <= contentForm.xj ? '/static/images/svg/star-active.svg' : '/static/images/svg/star-default.svg'"
              mode="aspectFit"
              @tap="setRating(n)"
            />
          </view>

          <text class="review__rating-text">{{ contentForm.xj }}星</text>
        </view>

        <!-- 评价内容 -->
        <view class="review__section">
          <textarea
            v-model="contentForm.pj"
            class="review__textarea"
            placeholder="是一家不错的老店，味道不错！"
            placeholder-class="review__textarea-placeholder"
            :maxlength="500"
          />

          <!-- 图片上传 -->
          <view class="review__upload-area">
            <view v-for="(img, i) in contentForm.tp" :key="i" class="review__upload-preview">
              <image class="review__upload-preview-img" :src="img" mode="aspectFill" />
              <view class="review__upload-del" @tap="removeImage(i)">×</view>
            </view>
            <view v-if="contentForm.tp.length < 4" class="review__upload-btn" @tap="chooseImage">
              <view class="review__upload-icon-wrap">
                <image class="review__upload-icon" src="/static/images/svg/upload.svg" mode="aspectFit" />
              </view>
              <text v-if="contentForm.tp.length === 0" class="review__upload-text">图片(0/4)</text>
              <text v-else class="review__upload-text">再加{{ 4 - contentForm.tp.length }}张</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部间距 -->
      <view style="height: 160rpx" />
    </scroll-view>

    <!-- 发布按钮 -->
    <!-- 提交按钮 -->
    <view class="complaint__submit-bar">
      <view class="complaint__submit-btn" :class="{ 'complaint__submit-btn--active': canSubmit }" @tap="submit">
        <text class="complaint__submit-text">发布</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { addComment } from '@/api/merchant'

const contentForm = reactive({
  xj: 5,
  pj: '',
  tp: [] as string[]
})
const pageId = ref('')
onLoad(options => {
  if (options?.id) {
    pageId.value = options.id
  }
})

// 判断是否可以提交（有评分且填写了内容）
const canSubmit = computed(() => {
  return contentForm.xj > 0 && contentForm.pj.trim().length > 0
})

function setRating(n: number) {
  contentForm.xj = n
}

function chooseImage() {
  if (contentForm.tp.length >= 4) {
    uni.showToast({ title: '最多上传4张图片', icon: 'none' })
    return
  }
  uni.chooseImage({
    count: 4 - contentForm.tp.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      // tempFilePaths 可能为 string | string[]，用 concat 安全合并
      const paths = Array.isArray(res.tempFilePaths) ? res.tempFilePaths : [res.tempFilePaths]
      contentForm.tp.push(...paths)
    }
  })
}

function removeImage(index: number) {
  contentForm.tp.splice(index, 1)
}

async function submit() {
  if (!canSubmit.value) {
    if (contentForm.xj === 0) {
      uni.showToast({ title: '请选择评分', icon: 'none' })
    }
    if (!contentForm.pj) {
      uni.showToast({ title: '请填写评价内容', icon: 'none' })
    }
    return
  }
  try {
    await addComment({
      datas: [
        {
          mainTable: { id: pageId.value },
          detail3: { ...contentForm }
        }
      ]
    })
    uni.showToast({ title: '提交成功', icon: 'success' })
    // setTimeout(() => uni.navigateBack(), 1500)
  } catch (e) {
    uni.showToast({ title: '提交失败，请重试', icon: 'none' })
  }

  uni.showToast({ title: '发布成功', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1500)
}
</script>

<style lang="scss">
.review {
  min-height: 100vh;
  padding-top: 46rpx;
  background: linear-gradient(180deg, #c3e9ff 0%, rgba(195, 233, 255, 0) 100%);
  position: relative;

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

  /* 星级评分 */
  &__rating {
    display: flex;
    align-items: center;
    gap: 24rpx;
    margin-bottom: 24rpx;
    padding: 0 24rpx;
  }

  &__rating-label {
    font-size: 30rpx;
    font-weight: 500;
    color: #000;
  }

  &__stars {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }

  &__star {
    width: 60rpx;
    height: 60rpx;
  }

  &__rating-text {
    font-size: 26rpx;
    color: #666;
    margin-left: 16rpx;
  }

  /* 评价内容区 */
  &__section {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    min-height: 400rpx;
  }

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
    display: flex;
    gap: 16rpx;
    flex-wrap: wrap;
    margin-top: 24rpx;
  }

  &__upload-btn {
    width: 152rpx;
    height: 152rpx;
    background: #f6f6f6;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
  }

  &__upload-icon-wrap {
    width: 68rpx;
    height: 68rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__upload-icon {
    width: 68rpx;
    height: 68rpx;
  }

  &__upload-text {
    font-size: 24rpx;
    color: #666;
  }

  &__upload-preview {
    width: 152rpx;
    height: 152rpx;
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

  /* 发布按钮 */
  &__submit-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;
    padding: 24rpx 69rpx;
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
    transition: opacity 0.3s;

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
