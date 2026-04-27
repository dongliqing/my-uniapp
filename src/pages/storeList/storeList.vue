<template>
    <view class="p-3 page-container">
        <view class="search-box">
            <view class="search-wrap">
                <uni-icons type="search" size="34rpx" color="#333" />
                <input v-model="searchValue" class="search-input" type="text" placeholder="搜索店铺"
                    placeholder-class="search-placeholder" confirm-type="search" @confirm="handleSearch" />
                <view class="search-btn" @tap="handleSearch">
                    <text>搜索</text>
                </view>
            </view>
        </view>

        <!-- Tab 标签 -->
        <view class="tabs-box">
            <view v-for="tab in tabs" :key="tab.key" class="tab-item" :class="{ active: activeTab === tab.key }"
                @tap="handleSwitchTab(tab.key)">
                <text>{{ tab.name }}</text>
                <text>{{ tab.count }}</text>
            </view>
        </view>

        <!-- 商家列表 -->
        <!-- eslint-disable-next-line -->
        <!-- <view v-for="item in storeList" :key="item.id" class="mb-3 p-3 bg-white rounded-lg flex"
            @click="goToDetail(item.id)">
            <image :src="item.image" class="w-20 h-20 rounded-md bg-gray-100" />
            <view class="ml-3 flex-1 flex flex-col justify-between">
                <view class="text-lg font-bold text-gray-800">{{ item.name }}</view>
                <view class="text-sm text-gray-500 line-clamp-1">{{ item.address }}</view>
                <view class="flex justify-between items-center">
                    <view class="text-orange-500 font-bold">￥{{ item.avgPrice }}/人</view>
                    <view class="text-xs text-gray-400">已售 {{ item.sales }}</view>
                </view>
            </view>
        </view> -->
        <StoreCard v-for="item in storeList" :key="item.id" :data="item" />

        <!-- 加载更多 -->
        <view class="text-center py-4 text-gray-400 text-sm">
            {{ loading ? '加载中...' : '没有更多了' }}
        </view>
    </view>
</template>

<script setup lang="ts">
import { getMessageInfo } from '@/api/home.ts'
import Storage from '@/utils/storage.ts'
import { onHide, onPageScroll, onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import StoreCard from './StoreCard.vue'

const fetchRequest = async () => {
    const res = await getMessageInfo({
        pageInfo: {
            pageNo: '1',
            pageSize: '10'
        }
    })
    console.log('获取成功', res)
}
fetchRequest()

interface Store {
    id: number
    name: string
    address: string
    avgPrice: number
    sales: number
    image: string
}
interface TabItem {
    key: string
    name: string
    count: number
}

const searchValue = ref('')
const storeList = ref<Store[]>([])
const loading = ref(false)
const scrollTop = ref(0)
// 分页参数
const pageParams = reactive({
    pageNum: 1,
    pageSize: 10
})

const handleSearch = () => { }

// Tab 配置
const tabs = ref<TabItem[]>([
    { key: 'all', name: '全部', count: 0 },
    { key: 'normal', name: '正常经营', count: 0 },
    { key: 'rectify', name: '整改中', count: 0 },
    { key: 'high', name: '高风险', count: 0 }
])
const activeTab = ref('all')
/**
 * 切换 Tab（分页重置）
 */
const handleSwitchTab = (key: string) => {
    if (activeTab.value === key) return
    activeTab.value = key
    // 重置分页并重新加载
    //   resetAndReload()
}

// 获取数据
const fetchData = async (isRefresh = false) => {
    if (loading.value) return
    loading.value = true

    // 模拟接口请求延时
    await new Promise(resolve => setTimeout(resolve, 800))

    // 模拟数据
    const mockData: Store[] = Array.from({ length: 10 }).map((_, i) => ({
        id: i + 1,
        name: `缙云特色餐厅 ${i + 1}`,
        address: `浙江省丽水市缙云县五云街道 ${i + 1} 号`,
        avgPrice: Math.floor(Math.random() * 100) + 30,
        sales: Math.floor(Math.random() * 1000)
        // image: 'https://via.placeholder.com/150',
    }))

    storeList.value = isRefresh ? mockData : [...storeList.value, ...mockData]

    // 缓存数据
    Storage.set('STORE_LIST_CACHE', storeList.value)

    loading.value = false
    uni.stopPullDownRefresh()
}

// 记录滚动位置
onPageScroll(e => {
    scrollTop.value = e.scrollTop
})

// 页面隐藏时保存位置
onHide(() => {
    Storage.setSession('STORE_LIST_SCROLL_TOP', scrollTop.value)
})

fetchData()
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
})

// 监听页面滚动到底部
onReachBottom(() => {
    console.log('触底了，开始加载更多...')
    // loadMoreData();
})

// 下拉刷新
onPullDownRefresh(() => {
    fetchData(true)
})

const goToDetail = (id: number) => {
    uni.navigateTo({
        url: `/pages/storeDetail/storeDetail?id=${id}`
    })
}
</script>

<style>
.page-container {
    background-image: linear-gradient(180deg, #c3e9ff 0%, transparent 100%);
    background-size: 100% 436rpx;
    background-repeat: no-repeat;
    background-color: #f5f5f5;
}

.search-box {
    /* padding: 24rpx 0; */
    position: relative;

    .search-wrap {
        height: 72rpx;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 54rpx;
        border: 2rpx solid rgba(23, 130, 252, 0.65);
        display: flex;
        align-items: center;
        padding: 0 16rpx 0 24rpx;
        gap: 12rpx;
    }

    .search-icon {
        width: 28rpx;
        height: 28rpx;
        flex-shrink: 0;
    }

    .search-input {
        flex: 1;
        font-size: 24rpx;
        color: #333;
        height: 100%;
    }

    .search-placeholder {
        color: #999;
        font-size: 24rpx;
    }

    .search-btn {
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
}

/* Tab 标签 */
.tabs-box {
    display: flex;
    align-items: center;
    padding: 0 8rpx;
    margin: 32rpx 0;
    gap: 28rpx;
    position: relative;

    .tab-item {
        height: 46rpx;
        padding: 0 12rpx;
        background: #f9fcfe;
        border-radius: 6rpx;
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: 28rpx;

        >text:nth-child(1) {
            color: #333;
            line-height: 46rpx;
        }

        >text:nth-child(2) {
            color: #999;
            line-height: 46rpx;
        }

        &.active {
            background: linear-gradient(233deg, #b3d7ff 0%, #bce7ff 100%);
            color: #1782fc;
            font-weight: 500;

            >text:nth-child(1) {
                color: #1782fc;
            }

            >text:nth-child(2) {
                color: #1782fc;
            }
        }
    }
}
</style>
