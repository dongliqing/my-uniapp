<template>
  <view class="rank-list">
    <!-- 内容区 -->
    <scroll-view
      class="rank-list__scroll"
      scroll-y
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onPullDownRefresh"
      @scrolltolower="loadMore"
      :lower-threshold="100"
    >
      <view class="rank-list__content">
        <view v-for="(item, index) in rankList" :key="index" class="rank-list__item" @tap="goDetail(item)">
          <text class="rank-list__item-title">{{ item.bt }}</text>
          <text class="rank-list__item-date">{{ item.fbrq }}</text>
        </view>

        <!-- 加载状态 -->
        <view v-if="!isEmpty" class="rank-list__status">
          <text v-if="isLoadingMore">加载中...</text>
          <text v-else-if="!hasMore">没有更多了</text>
        </view>

        <!-- 空状态 -->
        <view v-if="isEmpty && !loading" class="rank-list__empty">
          <text>暂无数据</text>
        </view>
      </view>

      <!-- TabBar 占位 -->
      <view style="height: 160rpx" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { getRankList } from '@/api/rank'

const PAGE_SIZE = 10

const rankList = ref<any[]>([])
const page = ref(1)
const hasMore = ref(true)
const isRefreshing = ref(false)
const isLoadingMore = ref(false)
const loading = ref(false)

const isEmpty = ref(false)

async function fetchData(isLoadMore = false) {
  if (loading.value) return

  if (!isLoadMore) {
    page.value = 1
    hasMore.value = true
  }

  loading.value = true

  try {
    const res: any = await getRankList({
      pageNo: page.value,
      pageSize: PAGE_SIZE
    })

    const list = res.datas?.map(item => item.mainTable)

    if (isLoadMore) {
      rankList.value = [...rankList.value, ...list]
    } else {
      rankList.value = list
    }

    // 判断是否还有更多数据
    const total = res?.total ?? res?.data?.total ?? list.length
    hasMore.value = rankList.value.length < total
    isEmpty.value = !isLoadMore && rankList.value.length === 0
  } catch (e) {
    console.error('获取榜单列表失败:', e)
  } finally {
    loading.value = false
    isLoadingMore.value = false
    if (isRefreshing.value) {
      nextTick(() => {
        isRefreshing.value = false
      })
    }
  }
}

/** 下拉刷新 */
function onPullDownRefresh() {
  isRefreshing.value = true
  fetchData()
}
/** 滚动到底部加载更多 */
function loadMore() {
  if (!hasMore.value || isLoadingMore.value || loading.value) return
  page.value++
  isLoadingMore.value = true
  fetchData(true)
}

function goDetail(item: any) {
  location.href = item.ywdzlj
}

fetchData()
</script>

<style lang="scss">
page {
  background: #f5f5f5;
}

.rank-list {
  min-height: 100vh;
  background: #f5f5f5;

  &__scroll {
    position: relative;
  }

  &__content {
    padding: 24rpx;
    padding-top: 46rpx;
  }

  &__item {
    background: #fdfdfd;
    border-radius: 16rpx;
    border: 1rpx solid #d9d9d9;
    padding: 32rpx 24rpx;
    margin-bottom: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__item-title {
    font-size: 26rpx;
    color: #000;
  }

  &__item-date {
    font-size: 24rpx;
    color: #666;
  }
  &__status {
    text-align: center;
    padding: 24rpx 0;
  }
}
</style>
