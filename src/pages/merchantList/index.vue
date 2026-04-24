<template>
  <view class="merchant-page">
    <view class="merchant-page__search">
      <view class="merchant-page__search-wrap">
        <image class="merchant-page__search-icon" src="/static/images/svg/search.svg" mode="aspectFit" />
        <input v-model="keyword" class="merchant-page__search-input" type="text" placeholder="李记饼店"
          placeholder-class="merchant-page__search-placeholder" confirm-type="search" @confirm="handleSearch" />
        <view class="merchant-page__search-btn" @tap="handleSearch">
          <text>搜索</text>
        </view>
      </view>
    </view>

    <!-- Tab 标签 -->
    <view class="merchant-page__tabs">
      <view v-for="tab in tabs" :key="tab.key" class="merchant-page__tab"
        :class="{ 'merchant-page__tab--active': activeTab === tab.key }" @tap="handleSwitchTab(tab.key)">
        <text>{{ tab.name }}</text>
        <text>{{ tab.count }}</text>
      </view>
    </view>

    <!-- 列表滚动区 -->
    <scroll-view refresher-enabled :refresher-triggered="refreshing" @refresherrefresh="onPullDownRefresh" scroll-y
      class="merchant-page__scroll" :style="{ height: scrollHeight + 'px' }" @scrolltolower="loadMore">
      <!-- 商家列表 -->
      <view class="merchant-page__list">
        <MerchantCard v-for="item in listData" :key="item.id" :data="item" @click="goDetail" />
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && listData.length === 0" class="merchant-page__empty">
        <text>暂无数据</text>
      </view>

      <!-- 加载更多状态 -->
      <view v-if="listData.length > 0" class="merchant-page__load-more">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import MerchantCard from '@/components/MerchantCard.vue'

// ==================== 系统信息 & 布局计算 ====================
const statusBarHeight = ref(20)
const navBarHeight = ref(44)
const placeholderHeight = ref(0)
const scrollHeight = ref(0)

function calcLayout() {
  const sysInfo = uni.getSystemInfoSync()
  const winHeight = sysInfo.windowHeight
  statusBarHeight.value = sysInfo.statusBarHeight || 20
  try {
    const menuBtn = uni.getMenuButtonBoundingClientRect()
    navBarHeight.value = menuBtn.height + (menuBtn.top - statusBarHeight.value) * 2
  } catch {
    navBarHeight.value = 44
  }
  // 搜索栏高度 + Tab高度 + padding
  // 搜索栏约72rpx->36px，Tab约46rpx->23px，padding约32rpx->16px
  const searchAreaHeight = 36 + 16 + 23 + 8
  placeholderHeight.value = statusBarHeight.value + navBarHeight.value + searchAreaHeight
  scrollHeight.value = winHeight - placeholderHeight.value
}

// ==================== 数据定义 ====================
interface MerchantItem {
  id: string | number
  name: string
  img: string
  stars: number
  score: number
  distance: string
  category: string
  area: string
  year: number
  badge: string
  badge2?: string
  complaint: number
  penalty: number
  status: 'normal' | 'rectify' | 'high'
}

interface TabItem {
  key: string
  name: string
  count: number
}

// ==================== 响应式状态 ====================
const keyword = ref('')
const activeTab = ref('all')
const loading = ref(false)
const refreshing = ref(false)
const noMore = ref(false)

// Tab 配置
const tabs = ref<TabItem[]>([
  { key: 'all', name: '全部', count: 0 },
  { key: 'normal', name: '正常经营', count: 0 },
  { key: 'rectify', name: '整改中', count: 0 },
  { key: 'high', name: '高风险', count: 0 }
])

// 分页参数
const pageParams = reactive({
  pageNum: 1,
  pageSize: 10
})

// 列表数据
const listData = ref<MerchantItem[]>([])

// ==================== API 调用预留接口 ====================
/**
 * 获取商户列表数据 - 预留接口
 * TODO: 替换为真实 API 调用
 */
async function fetchMerchantList(isRefresh = false): Promise<{
  list: MerchantItem[]
  total: number
  tabCounts: Record<string, number>
}> {
  // ===== 真实项目替换为以下方式 =====
  // const res = await uni.request({
  //   url: '/api/merchant/list',
  //   method: 'GET',
  //   data: {
  //     keyword: keyword.value,
  //     status: activeTab.value === 'all' ? '' : activeTab.value,
  //     pageNum: pageParams.pageNum,
  //     pageSize: pageParams.pageSize
  //   }
  // })
  // return res.data as { ... }

  // 模拟异步请求
  return new Promise(resolve => {
    setTimeout(() => {
      const mockList: MerchantItem[] = [
        {
          id: 1,
          name: '缙云烧饼东门老字号烧饼',
          img: '/static/detail/47.png',
          stars: 5,
          score: 86.9,
          distance: '2.3km',
          category: '小吃简餐',
          area: '老城',
          year: 10,
          badge: '缙云传味',
          badge2: '标杆单位',
          complaint: 0,
          penalty: 0,
          status: 'normal'
        },
        {
          id: 2,
          name: '缙云烧饼东门老字号烧饼',
          img: '/static/detail/48.png',
          stars: 5,
          score: 86.9,
          distance: '2.7km',
          category: '小吃简餐',
          area: '老城',
          year: 10,
          badge: '缙云传味',
          complaint: 22,
          penalty: 5,
          status: 'rectify'
        },
        {
          id: 3,
          name: '缙云烧饼东门老字号烧饼',
          img: '/static/detail/49.png',
          stars: 5,
          score: 86.9,
          distance: '4.6km',
          category: '小吃简餐',
          area: '老城',
          year: 10,
          badge: '缙云传味',
          complaint: 51,
          penalty: 22,
          status: 'high'
        },
        {
          id: 4,
          name: '李记饼店',
          img: '/static/detail/47.png',
          stars: 4,
          score: 82.5,
          distance: '1.5km',
          category: '小吃简餐',
          area: '新城',
          year: 5,
          badge: '缙云新味',
          complaint: 2,
          penalty: 0,
          status: 'normal'
        },
        {
          id: 5,
          name: '老王烧饼铺',
          img: '/static/detail/48.png',
          stars: 5,
          score: 88.0,
          distance: '3.2km',
          category: '早餐',
          area: '老城',
          year: 15,
          badge: '缙云守味',
          badge2: '标杆单位',
          complaint: 5,
          penalty: 1,
          status: 'rectify'
        }
      ]

      // 模拟分页：第一页返回全部模拟数据，后续无数据
      let result: MerchantItem[] = []
      if (pageParams.pageNum === 1) {
        result = mockList.filter(item => {
          // 按 tab 过滤
          if (activeTab.value !== 'all' && item.status !== activeTab.value) return false
          // 按关键词过滤
          if (keyword.value.trim()) {
            const key = keyword.value.trim().toLowerCase()
            return item.name.toLowerCase().includes(key) || item.category.includes(key) || item.area.includes(key)
          }
          return true
        })
      }

      resolve({
        list: result,
        total: result.length,
        tabCounts: { all: 23, normal: 10, rectify: 8, high: 5 }
      })
    }, 600)
  })
}

// ==================== 核心方法 ====================
/**
 * 加载列表数据（内部方法）
 */
async function loadData(isRefresh = false) {
  if (loading.value) return
  loading.value = true

  try {
    const res = await fetchMerchantList(isRefresh)

    if (isRefresh) {
      listData.value = res.list
    } else {
      listData.value.push(...res.list)
    }

    // 更新 Tab 计数
    tabs.value.forEach(tab => {
      tab.count = res.tabCounts[tab.key] ?? 0
    })

    // 判断是否还有更多
    noMore.value = listData.value.length >= res.total
  } catch (err) {
    console.error('获取商户列表失败:', err)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

/**
 * 下拉刷新
 */
async function onPullDownRefresh() {
  refreshing.value = true
  pageParams.pageNum = 1
  noMore.value = false
  await loadData(true)
  refreshing.value = false
}

/**
 * 切换 Tab（分页重置）
 */
function handleSwitchTab(key: string) {
  if (activeTab.value === key) return
  activeTab.value = key
  // 重置分页并重新加载
  resetAndReload()
}

/**
 * 搜索
 */
function handleSearch() {
  resetAndReload()
}

/**
 * 重置分页参数并重新加载数据
 */
function resetAndReload() {
  pageParams.pageNum = 1
  noMore.value = false
  listData.value = []
  loadData(true)
}

/**
 * 滚动到底部加载更多
 */
function loadMore() {
  if (loading.value || noMore.value) return
  pageParams.pageNum++
  loadData()
}

/**
 * 跳转详情页
 */
function goDetail(id: string | number) {
  uni.navigateTo({ url: `/pages/merchantDetail/index?id=${id}` })
}

// ==================== 生命周期 ====================
onMounted(() => {
  calcLayout()
  nextTick(() => {
    calcLayout()
  })
  loadData(true)
})
</script>

<style lang="scss" scoped>
.merchant-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;

  /* 固定顶部区域 */
  &__fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  &__nav-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 612rpx;
    background: linear-gradient(180deg, #c3e9ff 0%, rgba(195, 233, 255, 0) 100%);
  }

  /* 搜索栏 */
  &__search {
    padding: 24rpx;
    position: relative;
  }

  &__search-wrap {
    height: 72rpx;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 54rpx;
    border: 2rpx solid rgba(23, 130, 252, 0.65);
    display: flex;
    align-items: center;
    padding: 0 16rpx 0 24rpx;
    gap: 12rpx;
  }

  &__search-icon {
    width: 28rpx;
    height: 28rpx;
    flex-shrink: 0;
  }

  &__search-input {
    flex: 1;
    font-size: 24rpx;
    color: #333;
    height: 100%;
  }

  &__search-placeholder {
    color: #999;
    font-size: 24rpx;
  }

  &__search-btn {
    width: 120rpx;
    height: 60rpx;
    background: linear-gradient(237deg, #1782fc 0%, #46b2ff 100%);
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    text {
      font-size: 26rpx;
      color: #fff;
    }
  }

  /* Tab 标签 */
  &__tabs {
    display: flex;
    align-items: center;
    padding: 8rpx 24rpx 16rpx;
    gap: 16rpx;
    position: relative;
  }

  &__tab {
    height: 46rpx;
    padding: 4rpx 12rpx;
    background: #f9fcfe;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;

    text:nth-child(1) {
      font-size: 28rpx;
      color: #333;
      font-weight: 400;
    }

    text:nth-child(2) {
      font-size: 28rpx;
      color: #999;
    }

    &--active {
      background: linear-gradient(233deg, #b3d7ff 0%, #bce7ff 100%);

      text:nth-child(1) {
        color: #1782fc;
        font-weight: 500;
      }

      text:nth-child(2) {
        color: #1782fc;
      }
    }
  }

  /* 占位 */
  &__placeholder {
    flex-shrink: 0;
  }

  /* 滚动区域 */
  &__scroll {
    flex: 1;
  }

  /* 列表 */
  &__list {
    padding: 0 24rpx 24rpx;
  }

  /* 空状态 */
  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120rpx 0;

    text {
      font-size: 28rpx;
      color: #999;
    }
  }

  /* 加载更多 */
  &__load-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24rpx 0;

    text {
      font-size: 24rpx;
      color: #999;
    }
  }
}
</style>
