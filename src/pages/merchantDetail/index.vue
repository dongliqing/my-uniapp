<template>
    <view class="detail-page">
        <!-- 滚动区域 -->
        <scroll-view scroll-y class="detail-page__scroll" @scroll="onScroll">
            <!-- 头部大图（支持预览） -->
            <view class="detail-page__hero" @tap="previewImage(merchantInfo.heroImage)">
                <image class="detail-page__hero-img" :src="merchantInfo.heroImage" mode="aspectFill" />
            </view>
            <view class="detail-page__content">
                <!-- 商家信息卡片 -->
                <view class="detail-page__info">
                    <!-- 商家名称 -->
                    <text class="detail-page__name">{{ merchantInfo.name }}</text>
                    <!-- 评分行：星级 + 分数 + 分类 + 区域 -->
                    <view class="detail-page__rating-row">
                        <view class="detail-page__stars-row">
                            <StarRating :value="merchantInfo.stars" class="detail-page__stars" />
                            <text class="detail-page__score">
                                {{ merchantInfo.score }}分
                            </text>
                        </view>
                        <view class="detail-page__category-row">
                            <text class="detail-page__category">{{ merchantInfo.category }}</text>
                            <text class="detail-page__area">{{ merchantInfo.area }}</text>
                        </view>
                    </view>

                    <!-- 标签行 -->
                    <view class="detail-page__tags">
                        <view class="detail-page__tag detail-page__tag--year">
                            <image class="detail-page__tag-icon" src="/static/images/svg/merchantDetail/17.svg"
                                mode="aspectFit" />
                            <text>{{ merchantInfo.year }}年店铺</text>
                        </view>
                        <view v-for="(badge, idx) in merchantInfo.badges" :key="idx"
                            class="detail-page__tag detail-page__tag--badge">
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
                        <image class="detail-page__info-arrow" src="/static/images/svg/merchantDetail/18.svg"
                            mode="aspectFit" />
                    </view>
                </view>

                <!-- Tab 栏 -->
                <view class="detail-page__tab-bar" :class="{ 'detail-page__tab-bar--fixed': tabFixed }">
                    <view v-for="tab in tabs" :key="tab.key" class="detail-page__tab"
                        :class="{ 'detail-page__tab--active': activeTab === tab.key }" @tap="switchTab(tab.key)">
                        <text>{{ tab.name }}</text>
                        <view v-if="activeTab === tab.key" class="detail-page__tab-indicator" />

                    </view>
                    <!-- 活动Tab渐变下划线 -->
                </view>

                <!-- Tab 内容区 - 组件化 -->
                <view class="detail-page__tab-content">
                    <!-- 商家管理 -->
                    <ManagePanel v-show="activeTab === 'manage'" />

                    <!-- 商家故事 -->
                    <StoryPanel v-show="activeTab === 'story'" :stories="stories" />

                    <!-- 特色菜品（支持滚动加载更多） -->
                    <DishesPanel v-show="activeTab === 'dishes'" :dishes="dishes" :loading="dishesLoading"
                        :no-more="dishesNoMore" @load-more="loadMoreDishes" />

                    <!-- 互动（支持滚动加载更多） -->
                    <InteractPanel v-show="activeTab === 'interact'" :comments="comments" :loading="commentsLoading"
                        :no-more="commentsNoMore" @load-more="loadMoreComments" />
                    <!-- ============ 抽检信息 ============ -->
                    <view v-show="activeTab === 'inspection'" class="manage__gallery-section">
                        <image class="manage__gallery-bg" src="/static/images/svg/merchantDetail/39.svg"
                            mode="aspectFill" />
                        <text class="manage__gallery-title">抽检信息</text>
                        <scroll-view class="manage__gallery-scroll" scroll-x>
                            <view class="manage__gallery-list">
                                <view v-for="(img, i) in inspectImages" :key="i" class="manage__gallery-item"
                                    @tap="previewGallery(inspectImages, i)">
                                    <image class="manage__gallery-img" :src="img" mode="aspectFill" />
                                </view>
                            </view>
                        </scroll-view>
                    </view>
                </view>
            </view>


            <!-- 底部占位 -->
            <view style="height: 146rpx" />
        </scroll-view>

        <!-- 底部操作栏 -->
        <view class="detail-page__bottom-bar">
            <image class="detail-page__bottom-line" src="/static/images/svg/merchantDetail/35.svg" mode="aspectFit" />
            <view class="detail-page__bottom-btn" @tap="goComplaint">
                <image class="detail-page__bottom-icon" src="/static/images/svg/merchantDetail/complaint.svg"
                    mode="aspectFit" />
                <text>提投诉</text>
            </view>
            <view class="detail-page__bottom-btn" @tap="goReview">
                <image class="detail-page__bottom-icon" src="/static/images/svg/merchantDetail/comment.svg"
                    mode="aspectFit" />
                <text>写评价</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StarRating from '@/components/StarRating.vue'
import ManagePanel from './ManagePanel.vue'
import StoryPanel from './StoryPanel.vue'
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
}

// ==================== 系统信息 ====================
const statusBarHeight = ref(20)
const navBarHeight = ref(44)
const tabFixed = ref(false)

onMounted(() => {
    // 获取系统信息和导航栏高度
    const sysInfo = uni.getSystemInfoSync()
    statusBarHeight.value = sysInfo.statusBarHeight || 20
    try {
        const menuBtn = uni.getMenuButtonBoundingClientRect()
        navBarHeight.value = menuBtn.height + (menuBtn.top - statusBarHeight.value) * 2
    } catch {
        navBarHeight.value = 44
    }

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
    address: '缙云县鹿园巷1号'
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
const stories = ref<StoryItem[]>([
    {
        title: '老字号的传承',
        content: '这家店从2001年开业至今，已经走过了二十多个年头。店主老李坚持使用传统工艺，每天凌晨3点就开始和面、准备食材，只为给顾客提供最正宗的缙云烧饼。',
        images: ['/static/images/svg/merchantDetail/37.png']
    },
    {
        title: '匠心制作',
        content: '烧饼的面团要经过三次发酵，馅料选用本地土猪肉，配以秘制的梅干菜和葱花。每一个烧饼都是手工现做，保证外酥里嫩，香气四溢。',
        images: ['/static/images/svg/merchantDetail/38.png', '/static/images/svg/merchantDetail/40.png']
    }
])

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
const inspectImages = [
    '/static/images/svg/merchantDetail/49.png',
    '/static/images/svg/merchantDetail/49.png',
    '/static/images/svg/merchantDetail/49.png',
]

function previewGallery(urls: string[], current: number) {
    uni.previewImage({ current: urls[current], urls })
}
</script>

<style lang="scss" scoped>
.detail-page {
    min-height: 100vh;
    background: #f5f5f5;

    &__content {
        margin-top: -20rpx;
        border-radius: 25rpx;
        overflow: hidden;
    }

    /* ====== 滚动区域 ====== */
    &__scroll {
        position: relative;
        z-index: 5;
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
        background: linear-gradient(180deg, #C3E9FF 0, #fff 25%);

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
        z-index: 50;

        &--fixed {
            position: sticky;
            top: 0;
            box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
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
        z-index: 200;
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

    // =================== 原材料看台 / 抽检信息 ===================
    &__gallery-section {
        position: relative;
        padding: 24rpx;
        margin-bottom: 0;
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
        background: #D9D9D9;
        flex-shrink: 0;
    }

    &__gallery-img {
        width: 100%;
        height: 100%;
    }
}
</style>
