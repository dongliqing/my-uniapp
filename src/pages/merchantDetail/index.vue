<template>
  <view class="detail-page">
    <!-- 滚动区域 -->
    <view scroll-y class="detail-page__scroll" @scroll="onScroll">
      <!-- 头部大图（支持预览） -->
      <view class="detail-page__hero" @tap="previewImage(merchantInfo.heroImage)">
        <image class="detail-page__hero-img" :src="merchantInfo.heroImage" mode="aspectFill" />
      </view>
      <view class="detail-page__content">
        <!-- 商家信息卡片 -->
        <view class="detail-page__info">
          <!-- 商家名称 -->
          <image class="detail-page__name-logo" src="/static/images/svg/merchantDetail/status-normal.svg" />
          <text class="detail-page__name">{{ merchantInfo.name }}</text>
          <!-- 评分行：星级 + 分数 + 分类 + 区域 -->
          <view class="detail-page__rating-row">
            <view class="detail-page__stars-row">
              <StarRating :value="merchantInfo.stars" class="detail-page__stars" />
              <text class="detail-page__score">{{ merchantInfo.score }}分</text>
            </view>
            <view class="detail-page__category-row">
              <text class="detail-page__category">{{ merchantInfo.category }}</text>
              <text class="detail-page__area">{{ merchantInfo.area }}</text>
            </view>
          </view>

          <!-- 标签行 -->
          <view class="detail-page__tags">
            <view class="detail-page__tag detail-page__tag--year">
              <image class="detail-page__tag-icon" src="/static/images/svg/shop.svg" mode="aspectFit" />
              <text>{{ merchantInfo.year }}年店铺</text>
            </view>
            <view v-for="(badge, idx) in merchantInfo.badges" :key="idx" class="detail-page__tag detail-page__tag--badge">
              <text>{{ badge }}</text>
            </view>
          </view>

          <!-- 营业信息行 -->
          <view class="detail-page__info-row">
            <text class="detail-page__info-text">营业时间：{{ merchantInfo.businessHours }}</text>
            <text class="detail-page__info-text-right">开业时间：{{ merchantInfo.openYear }}</text>
          </view>

          <!-- 地址行 -->
          <view class="detail-page__info-row">
            <text class="detail-page__info-text">{{ merchantInfo.address }}</text>
            <image class="detail-page__info-arrow" src="/static/images/svg/merchantDetail/18.svg" mode="aspectFit" />
          </view>
        </view>

        <!-- Tab 栏 -->
        <view class="detail-page__tab-bar" :class="{ 'detail-page__tab-bar--fixed': tabFixed }">
          <view v-for="tab in tabs" :key="tab.key" class="detail-page__tab" :class="{ 'detail-page__tab--active': activeTab === tab.key }" @tap="switchTab(tab.key)">
            <text>{{ tab.name }}</text>
            <view v-if="activeTab === tab.key" class="detail-page__tab-indicator" />
          </view>
          <!-- 活动Tab渐变下划线 -->
        </view>

        <!-- Tab 内容区 - 组件化 -->
        <view class="detail-page__tab-content">
          <!-- 商家管理 -->
          <view class="manage__score-section" v-show="activeTab === 'manage'">
            <!-- 标题行 -->
            <view class="manage__score-header">
              <view class="manage__score-title">
                <text style="margin-right: 12rpx">商家得分</text>
                <StarRating :value="4" />
              </view>
              <view class="manage__score-stars-row">
                <text class="manage__score-num-inline">86.9分</text>
              </view>
            </view>
            <!-- 雷达图 -->
            <ScoreRadarChart :dimensions="radarDimensions" :size="radarSize" class="manage__radar-wrap" />
            <!-- ============ 商家展示 ============ -->
            <view class="manage__card">
              <view class="manage__card-header">
                <text class="manage__section-title">商家展示</text>
              </view>
              <view class="manage__tags-row">
                <view class="manage__badge-tag">
                  <image class="manage__badge-icon" src="/static/images/svg/merchantDetail/45.svg" mode="aspectFit" />
                  <text class="manage__badge-text">证件齐全</text>
                </view>
                <view class="manage__badge-tag">
                  <image class="manage__badge-icon" src="/static/images/svg/merchantDetail/46.svg" mode="aspectFit" />
                  <text class="manage__badge-text">阳光厨房直播</text>
                </view>
              </view>
              <!-- ============ 商家亮点 ============ -->
              <view class="manage__highlight-card">
                <view class="manage__card-header">
                  <image class="manage__section-bar" src="/static/images/svg/merchantDetail/title_line.svg" mode="aspectFit" />
                  <text class="manage__section-title">商家亮点</text>
                </view>
                <view class="manage__highlight-item">
                  <image class="manage__highlight-icon" src="/static/images/svg/merchantDetail/high_comment.svg" mode="aspectFit" />
                  <text class="manage__highlight-label">维度名称</text>
                  <text class="manage__highlight-content">这里是评分项目内容</text>
                </view>
                <view class="manage__highlight-divider" />
                <view class="manage__highlight-item">
                  <image class="manage__highlight-icon" src="/static/images/svg/merchantDetail/high_comment.svg" mode="aspectFit" />
                  <text class="manage__highlight-label">维度名称</text>
                  <text class="manage__highlight-content">这里是评分项目内容</text>
                </view>
              </view>
              <!-- ============ 警示信息 ============ -->
              <view class="manage__highlight-card">
                <view class="manage__card-header">
                  <image class="manage__section-bar" src="/static/images/svg/merchantDetail/title_line.svg" mode="aspectFit" />
                  <text class="manage__section-title">警示信息</text>
                </view>
                <view class="manage__warning-row">
                  <view
                    v-for="item in warningItems"
                    :key="item.label"
                    class="manage__warning-item"
                    :class="item.count > 0 ? 'manage__warning-item--red' : 'manage__warning-item--blue'"
                  >
                    <image
                      class="manage__warning-svg"
                      :src="item.count > 0 ? '/static/images/svg/merchantDetail/abnormal_indicator.svg' : '/static/images/svg/merchantDetail/abnormal_success.svg'"
                      mode="aspectFit"
                    />
                    <view>
                      <view class="manage__warning-label">{{ item.label }}</view>
                      <view class="manage__warning-count" :class="item.count > 0 ? 'manage__warning-count--red' : 'manage__warning-count--blue'">
                        {{ item.count }}
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <!-- ============ 指标异常 ============ -->
              <view class="manage__highlight-card">
                <view class="manage__card-header">
                  <image class="manage__section-bar" src="/static/images/svg/merchantDetail/title_line.svg" mode="aspectFit" />
                  <text class="manage__section-title">指标异常</text>
                </view>
                <view class="manage__abnormal-row">
                  <image class="manage__abnormal-icon" src="/static/images/svg/merchantDetail/exception.svg" mode="aspectFit" />
                  <text class="manage__abnormal-text">社会责任指标得分较低</text>
                </view>
              </view>
            </view>

            <!-- ============ 原材料看台 ============ -->
            <view class="manage__gallery-section">
              <text class="manage__gallery-title">原材料看台</text>
              <scroll-view class="manage__gallery-scroll" scroll-x>
                <view class="manage__gallery-list">
                  <view v-for="(img, i) in rawImages" :key="i" class="manage__gallery-item" @tap="previewGallery(rawImages, i)">
                    <image class="manage__gallery-img" :src="img" mode="aspectFill" />
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>
          <!-- 商家故事 -->
          <view v-show="activeTab === 'story'">
            <view class="manage__score-section">
              <view class="manage__card-header">
                <text class="manage__section-title">商家得分</text>
              </view>
              <view class="detail-page__tags">
                <view class="detail-page__tag detail-page__tag--year">
                  <image class="detail-page__tag-icon" src="/static/images/svg/shop.svg" mode="aspectFit" />
                  <text>{{ merchantInfo.year }}年店铺</text>
                </view>
                <view v-for="(badge, idx) in merchantInfo.badges" :key="idx" class="detail-page__tag detail-page__tag--badge">
                  <text>{{ badge }}</text>
                </view>
              </view>
            </view>
            <view class="manage__score-section">
              <view class="manage__card-header">
                <text class="manage__section-title">商家荣誉</text>
              </view>
              <view v-for="honor in merchantInfo.honors" class="manage__card-item">
                <image src="/static/images/svg/merchantDetail/honor.png" />
                <text>{{ honor }}</text>
              </view>
            </view>
          </view>

          <!-- 特色菜品（支持滚动加载更多） -->
          <DishesPanel v-show="activeTab === 'dishes'" :dishes="dishes" :loading="dishesLoading" :no-more="dishesNoMore" @load-more="loadMoreDishes" />
          <!-- 互动（支持滚动加载更多） -->
          <InteractPanel v-show="activeTab === 'interact'" :comments="comments" :loading="commentsLoading" :no-more="commentsNoMore" @load-more="loadMoreComments" />
          <!-- ============ 抽检信息 ============ -->
          <view v-show="activeTab === 'inspection'" class="manage__gallery-section">
            <image class="manage__gallery-bg" src="/static/images/svg/merchantDetail/39.svg" mode="aspectFill" />
            <text class="manage__gallery-title">抽检信息</text>
            <scroll-view class="manage__gallery-scroll" scroll-x>
              <view class="manage__gallery-list">
                <view v-for="(img, i) in inspectImages" :key="i" class="manage__gallery-item" @tap="previewGallery(inspectImages, i)">
                  <image class="manage__gallery-img" :src="img" mode="aspectFill" />
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>

      <!-- 底部占位 -->
      <view style="height: 146rpx" />
    </view>

    <!-- 底部操作栏 -->
    <view class="detail-page__bottom-bar">
      <image class="detail-page__bottom-line" src="/static/images/svg/merchantDetail/35.svg" mode="aspectFit" />
      <view class="detail-page__bottom-btn" @tap="goComplaint">
        <image class="detail-page__bottom-icon" src="/static/images/svg/merchantDetail/complaint.svg" mode="aspectFit" />
        <text>提投诉</text>
      </view>
      <view class="detail-page__bottom-btn" @tap="goReview">
        <image class="detail-page__bottom-icon" src="/static/images/svg/merchantDetail/comment.svg" mode="aspectFit" />
        <text>写评价</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StarRating from '@/components/StarRating.vue'
import ScoreRadarChart from '@/components/ScoreRadarChart.vue'
import DishesPanel from './DishesPanel.vue'
import InteractPanel from './InteractPanel.vue'

// ==================== 类型定义 ====================
interface ScoreDimension {
  name: string
  score: number
}

interface StoryItem {
  title: string
  content: string
  images?: string[]
}

interface DishItem {
  name: string
  price: string
  image: string
}

interface CommentItem {
  id: number | string
  avatar: string
  nickname: string
  rating: number
  content: string
  images?: string[]
  time: string
}

interface MerchantDetail {
  id: number | string
  name: string
  heroImage: string
  stars: number
  score: number
  status: 'normal' | 'rectify' | 'high'
  category: string
  area: string
  year: number
  badges: string[]
  businessHours: string
  openYear: string
  address: string
  honors: string[]
}
const tabFixed = ref(false)

// ==================== 雷达图数据 ====================
const radarSize = ref(600)
const radarDimensions = [
  { name: '食品安全', score: 92 },
  { name: '社会责任', score: 60 },
  { name: '消费评价', score: 90 },
  { name: '合规经营', score: 88 },
  { name: '卫生环境', score: 75 }
]

// ==================== 警示信息 ====================
const warningItems = [
  { label: '年度投诉', count: 12 },
  { label: '年度处罚', count: 0 }
]

// ==================== 图片数据 ====================
const rawImages = ['/static/images/svg/merchantDetail/48.png', '/static/images/svg/merchantDetail/48.png', '/static/images/svg/merchantDetail/48.png']

function previewGallery(urls: string[], current: number) {
  uni.previewImage({ current: urls[current], urls })
}

onMounted(() => {
  // 雷达图自适应尺寸
  const sysInfo = uni.getSystemInfoSync()
  const rpxRatio = sysInfo.windowWidth / 750
  radarSize.value = Math.round(375 * rpxRatio)

  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  if (currentPage?.options?.id) {
    loadMerchantDetail(currentPage.options.id)
  }
})

// ==================== 页面参数 ====================
const activeTab = ref('manage')

const tabs = [
  { key: 'manage', name: '商家管理' },
  { key: 'story', name: '商家故事' },
  { key: 'dishes', name: '特色菜品' },
  { key: 'interact', name: '互动' },
  { key: 'inspection', name: '抽检信息' }
]

// ==================== 商家详情数据 ====================
const merchantInfo = ref<MerchantDetail>({
  id: 1,
  name: '缙云烧饼东门老字号烧饼',
  heroImage: '/static/images/svg/merchantDetail/36.png',
  stars: 4,
  score: 86.9,
  status: 'normal',
  category: '小吃简餐',
  area: '老城',
  year: 10,
  badges: ['缙云传味', '标杆单位'],
  businessHours: '06:30 - 18:00',
  openYear: '2001年',
  address: '缙云县鹿园巷1号',
  honors: ['2025年1月荣获“XXXXX荣誉', '2025年1月荣获“XXXXX荣誉”']
})

// 五维评分
const scoreDimensions = ref<ScoreDimension[]>([
  { name: '食品安全', score: 92 },
  { name: '环境卫生', score: 85 },
  { name: '服务态度', score: 88 },
  { name: '诚信经营', score: 90 },
  { name: '消费体验', score: 82 }
])

// 商家故事

// 特色菜品（支持滚动加载）
const dishes = ref<DishItem[]>([
  { name: '缙云烧饼（半肥半瘦）', price: '\u00a58', image: '/static/images/svg/merchantDetail/39.png' },
  { name: '缙云烧饼（全瘦肉）', price: '\u00a58', image: '/static/images/svg/merchantDetail/40.png' },
  { name: '缙云烧饼（加蛋）', price: '\u00a510', image: '/static/images/svg/merchantDetail/41.png' }
])
const dishesLoading = ref(false)
const dishesNoMore = ref(false)

async function loadMoreDishes() {
  if (dishesLoading.value || dishesNoMore.value) return
  dishesLoading.value = true
  // TODO: 调用API加载更多特色菜品
  setTimeout(() => {
    dishesLoading.value = false
    // dishesNoMore.value = true // 数据加载完毕后设置
  }, 500)
}

// 评论列表（支持滚动加载）
const comments = ref<CommentItem[]>([
  {
    id: 1,
    avatar: '/static/images/svg/merchantDetail/26.svg',
    nickname: 'habe乐',
    rating: 4,
    content: '一如既往的不错，比较清淡，适合南方人口味，酱油小馄饨值得推荐。',
    images: ['/static/images/svg/merchantDetail/37.png', '/static/images/svg/merchantDetail/39.png', '/static/images/svg/merchantDetail/40.png'],
    time: '2026-01-05'
  },
  {
    id: 2,
    avatar: '/static/images/svg/merchantDetail/32.svg',
    nickname: 'habe乐',
    rating: 4,
    content: '一如既往的不错，比较清淡，适合南方人口味，酱油小馄饨值得推荐。',
    images: ['/static/images/svg/merchantDetail/38.png', '/static/images/svg/merchantDetail/40.png', '/static/images/svg/merchantDetail/42.png'],
    time: '2026-01-05'
  }
])
const commentsLoading = ref(false)
const commentsNoMore = ref(false)

async function loadMoreComments() {
  if (commentsLoading.value || commentsNoMore.value) return
  commentsLoading.value = true
  // TODO: 调用API加载更多评论
  setTimeout(() => {
    commentsLoading.value = false
    // commentsNoMore.value = true // 数据加载完毕后设置
  }, 500)
}

// ==================== 计算属性 ====================
const statusText = computed(() => {
  const map = { normal: '正常经营', rectify: '整改中', high: '高风险' }
  return map[merchantInfo.value.status]
})

// ==================== 方法 ====================
function onScroll(e: any) {
  const scrollTop = e.detail.scrollTop
  tabFixed.value = scrollTop > 380
}

function switchTab(key: string) {
  activeTab.value = key
}

/** 单张图片预览 */
function previewImage(url: string) {
  uni.previewImage({ current: url, urls: [url] })
}

/** 返回上一页 */
function goBack() {
  uni.navigateBack()
}

/** 分享 */
function onShare() {
  // TODO: 实现分享逻辑
}

/** 加载商家详情 */
async function loadMerchantDetail(id: string | number) {
  console.log('加载商家详情:', id)
}

/** 跳转投诉页 */
function goComplaint() {
  uni.navigateTo({
    url: `/pages/complaint/index?id=${merchantInfo.value.id}&name=${encodeURIComponent(merchantInfo.value.name)}`
  })
}

/** 跳转评价页 */
function goReview() {
  uni.navigateTo({
    url: `/pages/review/index?id=${merchantInfo.value.id}&name=${encodeURIComponent(merchantInfo.value.name)}`
  })
}
const inspectImages = ['/static/images/svg/merchantDetail/49.png', '/static/images/svg/merchantDetail/49.png', '/static/images/svg/merchantDetail/49.png']
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: #f5f5f5;

  &__content {
    margin-top: -20rpx;
    border-radius: 25rpx;
    // 去掉 overflow: hidden，避免裁剪 canvas（type=2d canvas 可能溢出）
  }
  &__name-logo {
    position: absolute;
    top: -10rpx;
    right: 35rpx;
    width: 85rpx;
    height: 85rpx;
  }

  /* ====== 滚动区域 ====== */
  &__scroll {
    position: relative;
    z-index: 1;
    height: 100vh;
  }

  /* ====== 头部大图 ====== */
  &__hero {
    position: relative;
    width: 100%;
    height: 556rpx;
    background: #d9d9d9;
  }

  &__hero-img {
    width: 100%;
    height: 100%;
  }

  /* ====== 商家信息卡 ====== */
  &__info {
    padding: 42rpx 24rpx 0;
    position: relative;
    margin-top: -10rpx;
    background: linear-gradient(180deg, #c3e9ff 0, #fff 25%);
    border-radius: 36rpx;
  }

  &__info-deco {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4rpx;
  }

  /* 名称 */
  &__name {
    display: block;
    font-size: 40rpx;
    font-weight: 500;
    color: #000;
    line-height: 1.3;
  }

  /* 评分行 */
  &__rating-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10rpx;
    flex-wrap: wrap;
  }

  &__stars-row {
    display: flex;
    align-items: center;
  }

  &__stars {
    display: flex;
    align-items: center;
    gap: 2rpx;
    margin-right: 12rpx;
  }

  &__star {
    width: 28rpx;
    height: 28rpx;
  }

  &__star-half {
    width: 14rpx;
    height: 28rpx;
  }

  &__score {
    font-size: 24rpx;
    color: #1882fc;
    font-weight: 500;
  }

  &__score-unit {
    font-size: 22rpx;
  }

  &__category,
  &__area {
    font-size: 24rpx;
    color: #666;
  }

  &__category {
    margin-right: 12rpx;
  }

  /* 标签 */
  &__tags {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-top: 14rpx;
    flex-wrap: wrap;
    margin-bottom: 20rpx;
  }

  &__tag {
    display: flex;
    align-items: center;
    gap: 6rpx;
    height: 32rpx;
    border-radius: 2rpx;
    padding: 0 10rpx;

    text {
      font-size: 22rpx;
      white-space: nowrap;
    }

    &--year {
      background: rgba(255, 192, 155, 0.3);

      text {
        color: #823822;
      }
    }

    &--badge {
      background: #fff3e1;
      border: 2rpx solid #efce9c;

      text {
        color: #b2823a;
      }
    }
  }

  &__tag-icon {
    width: 28rpx;
    height: 28rpx;
    flex-shrink: 0;
  }

  /* 信息行 */
  &__info-row {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-top: 1rpx solid #d9d9d9;
  }

  &__info-icon {
    width: 28rpx;
    height: 28rpx;
    flex-shrink: 0;
  }

  &__info-text {
    font-size: 24rpx;
    color: #000;
  }

  &__info-text-right {
    font-size: 24rpx;
    color: #000;
    margin-left: auto;
    flex-shrink: 0;
  }

  &__info-arrow {
    width: 24rpx;
    height: 28rpx;
    margin-left: 8rpx;
    flex-shrink: 0;
  }

  /* ====== Tab 栏 ====== */
  &__tab-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    position: relative;
    z-index: 100; // 必须高于 scroll-view 内的 canvas

    &--fixed {
      position: sticky;
      top: 0;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
      background: linear-gradient(0deg, #d0e5fe 0%, #ffffff 100%);
    }
  }

  &__tab {
    position: relative;

    text {
      font-size: 28rpx;
      font-weight: 500;
      color: #000;
    }
  }

  &__tab-indicator {
    position: absolute;
    bottom: 0rpx;
    width: calc(100% + 16rpx);
    left: -8rpx;
    /* 45px * 2 */
    height: 38rpx;
    /* 15px * 2 */
    top: 5rpx;
    background: linear-gradient(180deg, transparent 30%, #42aeff 100%);
    border-radius: 36rpx;
    transition: all 0.3s ease;
    z-index: -1;
  }

  &__tab-deco {
    width: 100%;
    height: 12rpx;
    display: block;
  }

  /* ====== Tab 内容 ====== */
  &__tab-content {
    padding-bottom: 60rpx;
  }

  /* ====== 底部操作栏 ====== */
  &__bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 146rpx;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 164rpx;
    padding-bottom: env(safe-area-inset-bottom);
    z-index: 300; // 最高层级，确保在 canvas 之上
  }

  &__bottom-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4rpx;
  }

  &__bottom-btn {
    display: flex;
    align-items: center;
    gap: 12rpx;

    text {
      font-size: 26rpx;
      font-weight: 500;
      color: #000;
    }
  }

  &__bottom-icon {
    width: 46rpx;
    height: 46rpx;
  }
}

.manage {
  background: #f5f5f5;
  padding-bottom: 40rpx;

  // =================== 商家得分 ===================
  &__score-section {
    background: #fff;
    padding: 32rpx 24rpx 24rpx;
    margin-bottom: 20rpx;
    .manage__card-item {
      display: flex;
      align-items: center;
      margin-top: 24rpx;
      image {
        width: 58rpx;
        height: 58rpx;
        margin-right: 12rpx;
      }
    }
  }

  &__score-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
  }

  &__score-title {
    display: flex;
    align-items: center;
    font-size: 30rpx;
    font-weight: 500;
    color: #000;
  }

  &__score-total {
    display: flex;
    align-items: baseline;
    gap: 2rpx;
  }

  &__score-num {
    font-size: 48rpx;
    font-weight: 700;
    color: #1882fc;
    line-height: 1;
  }

  &__score-unit {
    font-size: 24rpx;
    font-weight: 500;
    color: #1882fc;
  }

  &__score-stars-row {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }

  &__score-num-inline {
    font-size: 26rpx;
    color: #1882fc;
    font-weight: 500;
  }

  // 雷达图容器
  &__radar-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 8rpx;
  }

  // =================== 通用卡片 ===================
  &__card {
    background: #fff;
    border-radius: 16rpx;
    margin-top: 24rpx;
  }

  &__card-header {
    display: flex;
    align-items: center;
  }

  &__section-bar {
    width: 8rpx;
    height: 32rpx;
    margin-right: 12rpx;
    flex-shrink: 0;
  }

  &__section-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #000;
  }

  // =================== 商家展示 ===================
  &__tags-row {
    display: flex;
    gap: 16rpx;
    flex-wrap: wrap;
    margin-top: 24rpx;
  }

  &__badge-tag {
    display: flex;
    align-items: center;
    gap: 8rpx;
    background: #fff3e1;
    border: 1rpx solid #efce9c;
    border-radius: 4rpx;
    padding: 10rpx 20rpx 10rpx 14rpx;
  }

  &__badge-icon {
    width: 40rpx;
    height: 40rpx;
    flex-shrink: 0;
  }

  &__badge-text {
    font-size: 24rpx;
    color: #b2823a;
  }

  // =================== 商家亮点 ===================
  &__highlight-card {
    margin-top: 24rpx;
    border-radius: 16rpx;
    background: #f5f5f5;
    padding: 24rpx 0;
  }

  &__highlight-item {
    display: flex;
    align-items: center;
    padding: 24rpx 12rpx;

    &:last-child {
      padding-bottom: 0;
    }
  }

  &__highlight-divider {
    height: 1rpx;
    background: rgba(0, 0, 0, 0.06);
    margin: 0 12rpx;
  }

  &__highlight-icon {
    width: 36rpx;
    height: 36rpx;
    margin-right: 12rpx;
    flex-shrink: 0;
  }

  &__highlight-label {
    font-size: 24rpx;
    color: #333;
    width: 120rpx;
    flex-shrink: 0;
  }

  &__highlight-content {
    font-size: 24rpx;
    color: #333;
    flex: 1;
  }

  // =================== 警示信息 ===================
  &__warning-row {
    display: flex;
    gap: 16rpx;
    padding: 0 12rpx;
    margin-top: 24rpx;
  }

  &__warning-item {
    flex: 1;
    border-radius: 16rpx;
    padding: 20rpx 16rpx 16rpx;
    display: flex;
    gap: 10rpx;

    &--red {
      background: linear-gradient(0deg, #ffe3e3 0%, #ffffff 100%);
      border: 1rpx solid #ff8587;
    }

    &--blue {
      background: linear-gradient(0deg, #d0e5fe 0%, #ffffff 100%);
      border: 1rpx solid #82bbff;
    }
  }

  &__warning-icon-wrap {
    width: 62rpx;
    height: 62rpx;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &--red {
      background: #d9d9d9;
    }
  }

  &__warning-svg {
    width: 62rpx;
    height: 62rpx;
  }

  &__warning-exclamation {
    font-size: 32rpx;
    font-weight: 700;
    color: #f21212;
  }

  &__warning-label {
    font-size: 24rpx;
    color: #333;
  }

  &__warning-count {
    font-size: 26rpx;
    font-weight: 500;

    &--red {
      color: #f23212;
    }

    &--blue {
      color: #1782fc;
    }
  }

  // =================== 指标异常 ===================
  &__abnormal-row {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 0 12rpx;
    margin-top: 24rpx;
  }

  &__abnormal-icon {
    width: 36rpx;
    height: 36rpx;
    flex-shrink: 0;
  }

  &__abnormal-text {
    font-size: 24rpx;
    color: #333;
  }

  // =================== 原材料看台 / 抽检信息 ===================
  &__gallery-section {
    position: relative;
    margin-top: 24rpx;
    background-color: #fff;
  }

  &__gallery-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  &__gallery-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #000;
    display: block;
    position: relative;
    z-index: 1;
    margin-bottom: 20rpx;
  }

  &__gallery-scroll {
    width: 100%;
    position: relative;
    z-index: 1;
  }

  &__gallery-list {
    display: flex;
    gap: 16rpx;
    padding-right: 8rpx;
    width: max-content;
  }

  &__gallery-item {
    width: 218rpx;
    height: 218rpx;
    border-radius: 16rpx;
    overflow: hidden;
    background: #d9d9d9;
    flex-shrink: 0;
  }

  &__gallery-img {
    width: 100%;
    height: 100%;
  }
}
</style>
