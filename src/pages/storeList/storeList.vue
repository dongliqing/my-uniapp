<template>
  <view class="p-3">
    <!-- 商家列表 -->
    <view
      v-for="item in storeList"
      :key="item.id"
      class="mb-3 p-3 bg-white rounded-lg shadow-sm flex"
      @click="goToDetail(item.id)"
    >
      <!-- <image :src="item.image" class="w-20 h-20 rounded-md bg-gray-100" /> -->
      <view class="ml-3 flex-1 flex flex-col justify-between">
        <view class="text-lg font-bold text-gray-800">{{ item.name }}</view>
        <view class="text-sm text-gray-500 line-clamp-1">{{ item.address }}</view>
        <view class="flex justify-between items-center">
          <view class="text-orange-500 font-bold">￥{{ item.avgPrice }}/人</view>
          <view class="text-xs text-gray-400">已售 {{ item.sales }}</view>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <view class="text-center py-4 text-gray-400 text-sm">
      {{ loading ? '加载中...' : '没有更多了' }}
    </view>
  </view>
</template>

<script setup lang="ts">
  import { onHide, onShow, onPullDownRefresh, onPageScroll } from '@dcloudio/uni-app';
  import Storage from '@/utils/storage.ts';

  interface Store {
    id: number;
    name: string;
    address: string;
    avgPrice: number;
    sales: number;
    image: string;
  }

  const storeList = ref<Store[]>([]);
  const loading = ref(false);
  const scrollTop = ref(0);

  // 获取数据
  const fetchData = async (isRefresh = false) => {
    if (loading.value) return;
    loading.value = true;

    // 模拟接口请求延时
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 模拟数据
    const mockData: Store[] = Array.from({ length: 10 }).map((_, i) => ({
      id: i + 1,
      name: `缙云特色餐厅 ${i + 1}`,
      address: `浙江省丽水市缙云县五云街道 ${i + 1} 号`,
      avgPrice: Math.floor(Math.random() * 100) + 30,
      sales: Math.floor(Math.random() * 1000),
      // image: 'https://via.placeholder.com/150',
    }));

    storeList.value = isRefresh ? mockData : [...storeList.value, ...mockData];

    // 缓存数据
    Storage.set('STORE_LIST_CACHE', storeList.value);

    loading.value = false;
    uni.stopPullDownRefresh();
  };

  // 记录滚动位置
  onPageScroll((e) => {
    scrollTop.value = e.scrollTop;
  });

  // 页面隐藏时保存位置
  onHide(() => {
    Storage.setSession('STORE_LIST_SCROLL_TOP', scrollTop.value);
  });

  fetchData();
  onShow(() => {
    // 1. 优先从缓存读取数据
    // const cache = Storage.get<Store[]>('STORE_LIST_CACHE');
    // if (cache && cache.length > 0) {
    //   storeList.value = cache;
    //   // 2. 恢复滚动位置
    //   const savedScrollTop = Storage.getSession<number>('STORE_LIST_SCROLL_TOP');
    //   if (savedScrollTop) {
    //     nextTick(() => {
    //       uni.pageScrollTo({
    //         scrollTop: savedScrollTop,
    //         duration: 0,
    //       });
    //     });
    //   }
    // } else {
    //   // 3. 无缓存则请求数据
    //   fetchData(true);
    // }
  });

  // 监听页面滚动到底部
  onReachBottom(() => {
    console.log('触底了，开始加载更多...');
    // loadMoreData();
  });

  // 下拉刷新
  onPullDownRefresh(() => {
    fetchData(true);
  });

  const goToDetail = (id: number) => {
    uni.navigateTo({
      url: `/pages/storeDetail/storeDetail?id=${id}`,
    });
  };
</script>

<style>
  page {
    background-color: #f8f8f8;
  }
</style>
