<template>
  <view class="check-detail">
    <!-- 主滚动区 -->
    <scroll-view class="check-detail__scroll" scroll-y>
      <!-- 活动信息卡片 -->
      <view class="check-detail__info-card">
        <text class="check-detail__info-title">活动详情</text>
        <text class="check-detail__info-desc">{{ activity.desc }}</text>
        <view class="check-detail__info-time">
          <text class="check-detail__time-text">活动时间：{{ activity.time }}</text>
        </view>
        <!-- 状态标签 -->
        <view
          class="check-detail__status"
          :class="activity.ongoing ? 'check-detail__status--active' : 'check-detail__status--ended'"
        >
          <text class="check-detail__status-text">
            {{ activity.ongoing ? '进行中' : '已结束' }}
          </text>
        </view>
      </view>

      <!-- 评论区 -->
      <view class="check-detail__comment-section">
        <text class="check-detail__section-title">评论区</text>

        <!-- 评论列表 -->
        <view class="check-detail__comment-list">
          <view v-for="comment in comments" :key="comment.id" class="check-detail__comment-item">
            <!-- 左侧头像 -->
            <image class="check-detail__comment-avatar" :src="comment.avatar" mode="aspectFill" />

            <!-- 右侧内容区 -->
            <view class="check-detail__comment-main">
              <!-- 头部：姓名 + 点赞 -->
              <view class="check-detail__comment-header">
                <text class="check-detail__comment-name">{{ comment.name }}</text>

                <!-- 点赞按钮 -->
                <view
                  class="check-detail__like"
                  :class="{ 'check-detail__like--active': comment.isLiked }"
                  @tap="toggleLike(comment)"
                >
                  <image
                    class="check-detail__like-icon"
                    :src="
                      comment.isLiked
                        ? '/static/images/svg/like-active.svg'
                        : '/static/images/svg/like.svg'
                    "
                    mode="aspectFit"
                  />
                  <text class="check-detail__like-count">{{ comment.likes }}</text>
                </view>
              </view>

              <!-- 评论内容 -->
              <text class="check-detail__comment-content">{{ comment.content }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部间距 -->
      <view style="height: 160rpx" />
    </scroll-view>

    <!-- 底部操作栏 - 仅进行中活动显示 -->
    <view v-if="activity.ongoing" class="check-detail__bottom-bar">
      <view class="check-detail__bottom-line" />
      <view class="check-detail__bottom-inner">
        <view class="check-detail__comment-btn" @tap="showCommentInput">
          <text class="check-detail__comment-btn-text">我要评论</text>
        </view>
      </view>
    </view>

    <!-- 评论输入弹窗 -->
    <view v-if="showInput" class="check-detail__input-mask" @tap="hideCommentInput">
      <view class="check-detail__input-panel" @tap.stop>
        <view class="check-detail__input-header">
          <text class="check-detail__input-title">发表评论</text>
          <view class="check-detail__input-close" @tap="hideCommentInput">
            <text class="check-detail__input-close-text">×</text>
          </view>
        </view>
        <textarea
          v-model="newComment"
          class="check-detail__input-area"
          placeholder="请输入您想要检查的商家..."
          placeholder-class="check-detail__input-placeholder"
          :maxlength="200"
          :focus="showInput"
          :adjust-position="true"
        />
        <view
          class="check-detail__input-submit"
          :class="{ 'check-detail__input-submit--active': newComment.trim().length > 0 }"
          @tap="submitComment"
        >
          <text class="check-detail__input-submit-text">发布</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showInput = ref(false)
const newComment = ref('')

onMounted(() => {})

// 活动信息
const activity = ref({
  id: 1,
  title: '炎炎夏日 饮品安全我想查',
  desc: '这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里是活动详情描述这里。',
  time: '2025-07-01至2025-12-31',
  ongoing: true
})

// 评论列表
const comments = ref([
  {
    id: 1,
    name: 'habe乐',
    avatar: '/static/detail/26.svg',
    content: '我想要检查霸王茶姬',
    date: '2026-01-05',
    likes: 123,
    isLiked: false
  },
  {
    id: 2,
    name: '李小小',
    avatar: '/static/detail/26.svg',
    content: '我想要检查霸王茶姬',
    date: '2026-01-05',
    likes: 123,
    isLiked: false
  },
  {
    id: 3,
    name: 'habe乐',
    avatar: '/static/detail/26.svg',
    content: '我想要检查霸王茶姬',
    date: '2026-01-05',
    likes: 123,
    isLiked: false
  }
])

function showCommentInput() {
  showInput.value = true
}

function hideCommentInput() {
  showInput.value = false
  newComment.value = ''
}

function submitComment() {
  if (!newComment.value.trim()) {
    uni.showToast({ title: '请输入评论内容', icon: 'none' })
    return
  }

  const comment = {
    id: Date.now(),
    name: '我',
    avatar: '/static/mine/15.svg',
    content: newComment.value.trim(),
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    isLiked: false
  }

  comments.value.unshift(comment)
  hideCommentInput()
  uni.showToast({ title: '发布成功', icon: 'success' })
}

function toggleLike(comment: any) {
  if (comment.isLiked) {
    comment.likes--
    comment.isLiked = false
  } else {
    comment.likes++
    comment.isLiked = true
  }
}
</script>

<style lang="scss">
.check-detail {
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;

  &__scroll {
    position: relative;
    z-index: 2;
  }

  /* 活动信息卡片 */
  &__info-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin: 24rpx;
    position: relative;
  }
  &__info-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #000;
    display: block;
    margin-bottom: 16rpx;
  }
  &__info-desc {
    font-size: 24rpx;
    color: #333;
    line-height: 1.6;
    display: block;
    padding-bottom: 32rpx;
    margin-bottom: 20rpx;
    border-bottom: 1rpx solid #d9d9d9;
  }
  &__info-time {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }
  &__time-icon {
    width: 28rpx;
    height: 28rpx;
  }
  &__time-text {
    font-size: 24rpx;
    color: #666;
  }
  &__status {
    position: absolute;
    right: 24rpx;
    top: 24rpx;
    &--active {
      .check-detail__status-text {
        color: #1782fc;
        font-weight: 500;
      }
    }
    &--ended {
      .check-detail__status-text {
        color: #999;
        font-weight: 500;
      }
    }
  }
  &__status-text {
    font-size: 28rpx;
  }

  /* 评论区 */
  &__comment-section {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin: 0 24rpx 24rpx;
  }
  &__section-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #000;
    display: block;
    margin-bottom: 24rpx;
  }

  &__comment-list {
    display: flex;
    flex-direction: column;
  }
  &__comment-item {
    display: flex;
    gap: 20rpx;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
  /* 头像样式 */
  &__comment-avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    flex-shrink: 0;
    background: #f5f5f5;
    border: 1rpx solid #f0f0f0;
  }
  /* 评论主内容区 */
  &__comment-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12rpx;
  }
  /* 头部：姓名 + 点赞 */
  &__comment-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
  }
  /* 姓名样式 */
  &__comment-name {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    line-height: 1.4;
  }
  /* 评论内容样式 - 处理长文本 */
  &__comment-content {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  /* 点赞按钮 */
  &__like {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 8rpx 12rpx;
    border-radius: 24rpx;
    background: transparent;
    transition: background 0.2s;
    &:active {
      background: #f5f5f5;
    }
    &--active {
      .check-detail__like-icon {
        // filter: hue-rotate(200deg) saturate(200%);
      }
      .check-detail__like-count {
        color: #666;
        font-weight: 500;
      }
    }
  }
  &__like-icon {
    width: 36rpx;
    height: 36rpx;
  }
  &__like-count {
    font-size: 24rpx;
    color: #999;
    min-width: 40rpx;
    text-align: center;
  }

  /* 底部操作栏 */
  &__bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 999;
    padding-bottom: env(safe-area-inset-bottom);
  }
  &__bottom-line {
    height: 1rpx;
    background: #eee;
  }
  &__bottom-inner {
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 69rpx;
  }
  &__comment-btn {
    width: 612rpx;
    height: 78rpx;
    background: #1882fc;
    border-radius: 51rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__comment-btn-text {
    font-size: 32rpx;
    color: #fff;
    letter-spacing: 6rpx;
  }

  /* 输入弹窗 */
  &__input-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
  }
  &__input-panel {
    width: 100%;
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;
    padding: 24rpx;
    padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  }
  &__input-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
  }
  &__input-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #000;
  }
  &__input-close {
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__input-close-text {
    font-size: 40rpx;
    color: #999;
    line-height: 1;
  }
  &__input-area {
    width: 100%;
    height: 200rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    padding: 16rpx;
    font-size: 28rpx;
    color: #333;
    box-sizing: border-box;
  }
  &__input-placeholder {
    color: #999;
    font-size: 28rpx;
  }
  &__input-submit {
    margin-top: 24rpx;
    width: 100%;
    height: 78rpx;
    background: #1882fc;
    border-radius: 51rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
    &--active {
      opacity: 1;
    }
  }
  &__input-submit-text {
    font-size: 32rpx;
    color: #fff;
    letter-spacing: 6rpx;
  }
}
</style>
