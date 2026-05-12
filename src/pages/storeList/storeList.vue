<template>
  <view class="page-container">
    <view class="px-3 pt-3 fixed left-0 right-0 z-10 header">
      <view class="search-box">
        <view class="search-wrap">
          <uni-icons type="search" size="34rpx" color="#333" />
          <input
            ref="searchInput"
            v-model="searchValue"
            class="search-input"
            type="text"
            placeholder="搜索店铺"
            placeholder-class="search-placeholder"
            confirm-type="search"
            @confirm="getData"
          />
          <view class="search-btn" @tap="getData">
            <text>搜索</text>
          </view>
        </view>
      </view>
      <view class="tabs-box">
        <view v-for="tab in tabs" :key="tab.key" class="tab-item" :class="{ active: activeTab === tab.key }" @tap="handleSwitchTab(tab.key, tab.status)">
          <text>{{ tab.name }}</text>
          <text>{{ tab.count }}</text>
        </view>
      </view>
    </view>
    <!-- 商家列表 -->
    <view class="px-3 pt-[208rpx] IStore-list">
      <StoreCard v-for="item in storeList" :key="item.id" :data="item" />
      <!-- 加载更多 -->
      <view class="text-center pt-3 pb-6 text-gray-400 text-sm">
        {{ loading ? '加载中...' : '没有更多了' }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// import Storage from '@/utils/storage.ts'
import { onHide, onPageScroll, onPullDownRefresh, onShow } from '@dcloudio/uni-app';
import StoreCard from './StoreCard.vue';
import { getStoreInfo, getScoreInfo } from '@/api/store.ts';
// import { IStore } from './constant.ts';

interface IStore {
  id: number;
  storeName: string;
  address: string;
  image: string;
  star: number;
  yearType: string;
  tags: string[];
  statusNo: string;
  statusLabel: string;
  complaint: string;
  caseHandle: string;
}
interface TabItem {
  key: string;
  name: string;
  count: number;
  status: string;
}

const searchInput = ref();
const searchValue = ref('');
const storeList = ref<IStore[]>([]);
const loading = ref(false);
// const scrollTop = ref(0);
const yearType = ref(''); //年份类型
const status = ref(''); //状态类型  0:正常经营1:整改中2:停业
const tabs = ref<TabItem[]>([
  { key: 'all', name: '全部', count: 0, status: '' },
  { key: 'normal', name: '正常经营', count: 0, status: '0' },
  { key: 'rectify', name: '整改中', count: 0, status: '1' },
  { key: 'stop', name: '停业', count: 0, status: '2' }
]);
const activeTab = ref('all');

onLoad(options => {
  console.log(options);
  yearType.value = options.yearType ?? '';
  getData();

  //光标定位到搜索框
  // searchInput.value.focus();
});

const getData = async () => {
  if (loading.value) return;
  loading.value = true;

  const res = await getStoreInfo({
    param: {
      nf: yearType.value,
      zt: status.value,
      name: searchValue.value
    },
    pageNo: 1,
    pageSize: 1000
  });

  console.log(res);

  storeList.value = (res.data || []).map(item => {
    return {
      id: item['商家id'],
      storeName: item['商家名称'],
      image: item['商家封面'],
      address: item['商家地址经度'] && item['商家地址纬度'] ? [item['商家地址经度'], item['商家地址纬度']] : [],
      star: Number(item['商家星级']),
      yearType: item['商家年份'],
      tags: item['商家标签'].split(','),
      statusNo: item['商家状态编码'],
      statusLabel: item['商家状态'],
      complaint: item['年度投诉'],
      caseHandle: item['立案查处']
    };
  });
  tabs.value.forEach((tab, index) => {
    if (index > 0) {
      tab.count = storeList.value.filter(item => item.statusNo === tab.status).length;
    } else {
      tab.count = storeList.value.length;
    }
  });

  loading.value = false;
  uni.stopPullDownRefresh();
};

// getScoreInfo({
//   mainTable: {
//     id: '1263017283388851285'
//     // "tyshxydm":""
//   },
//   pageInfo: {
//     pageNum: 1,
//     pageSize: 1000
//   }
// });

const handleSearch = () => {};

/**
 * 切换 Tab（分页重置）
 */
const handleSwitchTab = (key: string, sta: string) => {
  if (activeTab.value === key) return;
  activeTab.value = key;
  status.value = sta;
  // 重置分页并重新加载
  getData();
};

// 记录滚动位置
onPageScroll(e => {
  //   scrollTop.value = e.scrollTop
});

// 页面隐藏时保存位置
onHide(() => {
  //   Storage.setSession('STORE_LIST_SCROLL_TOP', scrollTop.value)
});

onShow(() => {});

// 监听页面滚动到底部
onReachBottom(() => {
  // console.log('触底了，开始加载更多...');
});

// 下拉刷新
onPullDownRefresh(() => {
  getData();
});

const goToDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/storeDetail/storeDetail?id=${id}`
  });
};
</script>

<style lang="scss" scoped>
.page-container {
  font-family: $font-family;
}

.header {
  background-image: linear-gradient(180deg, #c3e9ff 0%, #e0f0f9 100%);
  background-size: 100% 100%;
}
.IStore-list {
  background-image: linear-gradient(180deg, #c3e9ff 0%, #e0f0f9 212rpx, transparent 100%);
  background-size: 100% 650rpx;
  background-repeat: no-repeat;
  background-color: #f5f5f5;
  //背景不随滚动滚动
  background-attachment: fixed;
  min-height: calc(100vh - var(--status-bar-height) - var(--window-top) - var(--window-bottom));
  box-sizing: border-box;
}

.search-box {
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

    text:nth-child(1) {
      color: #333;
      line-height: 46rpx;
    }

    text:nth-child(2) {
      color: #999;
      line-height: 46rpx;
    }

    &.active {
      background: linear-gradient(233deg, #b3d7ff 0%, #a8d7f7 100%);
      font-weight: 600;

      text:nth-child(1) {
        color: #1782fc;
      }

      text:nth-child(2) {
        color: #1782fc;
      }
    }
  }
}
</style>
