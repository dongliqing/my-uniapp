<template>
  <view class="home-page">
    <!-- 顶部渐变背景 -->
    <view class="top-gradient">
      <image class="wave-decoration" src="@/static/images/home-bg.svg" mode="aspectFit" />
    </view>

    <!-- 品牌展示区 -->
    <view class="brand-showcase">
      <view v-for="(brand, index) in brandList" :key="index" class="brand-box" @click="navigateTo('/pages/storeList/storeList')">
        <view class="brand-item">
          <text class="brand-name">{{ brand.name }}</text>
          <image src="@/static/images/home-head-line.png" mode="aspectFit" class="line" />
          <view class="brand-years">
            <text class="year-num">{{ brand.yearStart }}</text>
            <text v-if="brand.yearEnd" class="year-num">-</text>
            <text v-if="brand.yearEnd" class="year-num">{{ brand.yearEnd }}</text>
            <text class="year-label">{{ brand.label }}</text>
          </view>
        </view>
        <image class="brand-medal mt-[-20rpx]" :src="brand.medal" mode="aspectFit" />
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar" @click="navigateTo('/pages/storeList/storeList')">
      <view class="search-box">
        <uni-icons type="search" size="34rpx" color="#333" />
        <text class="search-placeholder">搜索店铺</text>
      </view>
      <view class="search-btn">
        <text class="search-btn-text">搜索</text>
      </view>
    </view>

    <!-- 热门服务 -->
    <view class="section hot-services">
      <view class="section-header">
        <text class="section-title">热门服务</text>
      </view>
      <view class="services-grid">
        <!-- 红黑榜单 -->
        <view class="service-card" @click="navigateTo('/pages/rank/index')">
          <image class="card-bg" src="@/static/images/hot-services-bg.svg" mode="aspectFill" />
          <view class="card-content">
            <text class="card-title">红黑榜单</text>
            <view class="card-link">
              <text class="link-text">去看看</text>
              <uni-icons type="forward" size="22rpx" color="#333" />
            </view>
          </view>
          <view class="card-icon-wrap">
            <image class="card-icon" src="@/static/images/hot-service-1.png" mode="aspectFit" />
          </view>
        </view>
        <!-- 你点我查 -->
        <view class="service-card" @click="switchTo">
          <image class="card-bg" src="@/static/images/hot-services-bg.svg" mode="aspectFill" />
          <view class="card-content">
            <text class="card-title">你点我查</text>
            <view class="card-link">
              <text class="link-text">去看看</text>
              <uni-icons type="forward" size="22rpx" color="#333" />
            </view>
          </view>
          <view class="card-icon-wrap">
            <image class="card-icon" src="@/static/images/hot-service-2.png" mode="aspectFit" />
          </view>
        </view>
        <!-- 我要咨询 -->
        <view class="service-card" @click="navigateTo('/pages/rank/index')">
          <image class="card-bg" src="@/static/images/hot-services-bg.svg" mode="aspectFill" />
          <view class="card-content">
            <text class="card-title">我要咨询</text>
            <view class="card-link">
              <text class="link-text">去看看</text>
              <uni-icons type="forward" size="22rpx" color="#333" />
            </view>
          </view>
          <view class="card-icon-wrap">
            <image class="card-icon" src="@/static/images/hot-service-3.png" mode="aspectFit" />
          </view>
        </view>
      </view>
    </view>

    <!-- 商家星级 -->
    <view class="section store-stars">
      <image class="store-stars-bg" src="@/static/images/store-stars-bg.svg" mode="aspectFill" />
      <view class="section-header">
        <text class="section-title">商家星级</text>
      </view>
      <view class="stars-chart">
        <view v-for="(star, index) in starList" :key="index" class="star-row">
          <text class="star-label">{{ star.label }}</text>
          <view class="star-icons">
            <template v-if="star.active > 1">
              <image v-for="i in star.active" :key="'star-blue' + i" class="star-icon" src="@/static/images/star-blue.png" mode="scaleToFill" />
            </template>
            <template v-else>
              <image class="star-icon" src="@/static/images/star-red.png" mode="scaleToFill" />
            </template>
            <image v-for="i in index" :key="'star-gray' + i" class="star-icon" src="@/static/images/star-gray.png" mode="scaleToFill" />
          </view>
          <view v-if="star.percent" class="star-percent" :class="{ danger: star.percent <= 10 }">
            <view class="progress-bar" :style="{ width: star.percent + '%' }" />
            <text class="percent-num" :class="{ blue: star.percent < 50 && star.percent > 10, red: star.percent <= 10 }">{{ star.percent + '%' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 商家信息 -->
    <view class="section store-info">
      <view class="section-header">
        <text class="section-title">商家信息</text>
      </view>
      <view class="info-cards">
        <view v-for="(card, index) in storeInfoCards" :key="index" class="info-card">
          <image class="card-icon" src="@/static/images/store-info-bg.png" mode="aspectFill" />
          <text class="info-title">{{ card.title }}</text>
          <view class="info-num">
            <text class="num">{{ card.count }}</text>
            <text class="unit">家</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 最新资讯 -->
    <view class="section news !pb-0">
      <view class="section-header">
        <text class="section-title">最新资讯</text>
      </view>
      <view class="news-list">
        <view class="news-item" v-for="(item, index) in newsList" :key="index" @click="viewNews(item.id)">
          <text class="news-title">{{ item.title }}</text>
          <uni-icons type="forward" size="18" color="#999" class="news-arrow shrink-0" />
        </view>
      </view>
      <view class="view-more" @click="viewAllNews">
        <text class="more-text">查看更多</text>
        <uni-icons type="down" size="20" color="#1782fc" class="more-arrow" />
      </view>
    </view>

    <!-- 监管声明 -->
    <view class="supervision-declaration">
      <text class="declaration-text">由缙云县市场监管局监管</text>
    </view>
  </view>
</template>

<script setup lang="ts">
// import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';
import { ref } from 'vue'

// 当前年份
const currentYear = new Date().getFullYear()

// 品牌数据
const brandList = [
  {
    name: '缙云新味',
    yearStart: '1',
    yearEnd: '5',
    label: '年店铺',
    medal: '/static/images/home-head-1.png'
  },
  {
    name: '缙云知味',
    yearStart: '6',
    yearEnd: '9',
    label: '年店铺',
    medal: '/static/images/home-head-2.png'
  },
  {
    name: '缙云守味',
    yearStart: '10',
    yearEnd: '19',
    label: '年店铺',
    medal: '/static/images/home-head-3.png'
  },
  {
    name: '缙云传味',
    yearStart: '20',
    yearEnd: '',
    label: '年以上店铺',
    medal: '/static/images/home-head-4.png'
  }
]

// 星级数据
const starList = [
  {
    label: '五星',
    active: 5,
    percent: 100
  },
  {
    label: '四星',
    active: 4,
    percent: 80
  },
  {
    label: '三星',
    active: 3,
    percent: 66
  },
  {
    label: '二星',
    active: 2,
    percent: 32
  },
  {
    label: '一星',
    active: 1,
    percent: 10
  }
]

// 商家信息卡片数据
const storeInfoCards = [
  { title: '平台内商家', count: '12345' },
  { title: '外卖商家', count: '12345' },
  {
    title: '无堂食\n外卖商家',
    count: '12345'
  }
]

// 资讯列表数据
const newsList = ref([
  { id: 1, title: '最新资讯文案最新资讯文案最新资讯最多二十六个字符是客户打卡很多事阿是肯定会' },
  { id: 2, title: '最新资讯文案最新资讯文案最新资讯最多二十六个字符是客户打卡很多事阿是肯定会' },
  { id: 3, title: '最新资讯文案最新资讯文案最新资讯最多二十六个字符是客户打卡很多事阿是肯定会' },
  { id: 4, title: '最新资讯文案最新资讯文案最新资讯最多二十六个字符是客户打卡很多事阿是肯定会' },
  { id: 5, title: '最新资讯文案最新资讯文案最新资讯最多二十六个字符是客户打卡很多事阿是肯定会' }
])

// 导航到指定页面
const navigateTo = (path: string) => {
  uni.navigateTo({
    url: path
  })
}

const switchTo = () => {
  uni.switchTab({
    url: '/pages/check/index'
  })
}

// 查看资讯详情
const viewNews = (id: number) => {}

// 查看全部资讯
const viewAllNews = () => {}
</script>

<style lang="scss" scoped>
.home-page {
  background: #f5f5f5;
  position: relative;
  font-family: $font-family;
}

// 顶部渐变
.top-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 626rpx;
  z-index: 0;

  .wave-decoration {
    width: 100%;
    height: 100%;
  }
}

// 搜索栏
.search-bar {
  position: relative;
  z-index: 10;
  margin: 20rpx 24rpx 0;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 54rpx;
  border: 2rpx solid white;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
}

.search-icon {
  width: 30rpx;
  height: 30rpx;
  margin-right: 10rpx;
}

.search-placeholder {
  font-size: 24rpx;
  color: #999;
}

.search-btn {
  width: 120rpx;
  height: 60rpx;
  background: linear-gradient(237deg, #1782fc 0%, #46b2ff 100%);
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn-text {
  font-size: 26rpx;
  color: white;
  font-weight: 500;
}

// 品牌展示区
.brand-showcase {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  padding: 220rpx 26rpx 0;

  .brand-box:nth-child(even) {
    margin-top: 38rpx;
  }

  .brand-item {
    display: flex;
    position: relative;
    width: 80rpx;
    margin: auto;

    .brand-name {
      width: 32rpx;
      font-size: 26rpx;
      color: #010101;
      // margin-bottom: 8rpx;
      padding-right: 8rpx;
      font-weight: 600;
    }

    .line {
      width: 6rpx;
      height: 166rpx;
    }

    .brand-years {
      width: 32rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-wrap: wrap;
      // justify-content: center;
      margin-left: 8rpx;
    }

    .year-num {
      font-size: 24rpx;
      color: #2c64a4;
    }

    .year-label {
      font-size: 20rpx;
      color: #2c64a4;
      margin-left: 4rpx;
    }
  }

  .brand-medal {
    width: 145rpx;
    height: 145rpx;
    // margin-top: 8rpx;
  }
}

// 功能入口按钮
.feature-buttons {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 57rpx;
  margin-top: 20rpx;
}

.feature-btn {
  width: 145rpx;
  height: 145rpx;
  background: white;
  border-radius: 50%;
  box-shadow: 0 8rpx 8rpx rgba(23, 130, 252, 0.1);
  border: 2rpx solid rgba(145, 197, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon-wrap {
  width: 66rpx;
  height: 62rpx;
}

.btn-icon {
  width: 100%;
  height: 100%;
}

// 通用section样式
.section {
  margin: 24rpx;
  background: white;
  border-radius: 16rpx;
  padding: 24rpx;
  color: #000;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  position: relative;
  z-index: 10;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #000;
}

.section-year {
  margin-left: auto;
  font-size: 24rpx;
  color: #666;
}

.year-arrow {
  width: 20rpx;
  height: 20rpx;
  margin-left: 8rpx;
}

// 热门服务
.hot-services {
  position: relative;
  z-index: 5;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.service-card {
  height: 142rpx;
  border-radius: 16rpx;
  position: relative;
  overflow: hidden;
  padding: 9rpx 19rpx 9rpx 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .card-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}

.card-content {
  position: relative;
  z-index: 1;
  // display: flex;
  // flex-direction: column;
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-top: 12rpx;
}

.card-link {
  display: flex;
  align-items: center;
  margin-top: 30rpx;
}

.link-text {
  font-size: 22rpx;
  color: #333;
}

.link-arrow {
  width: 20rpx;
  height: 20rpx;
  margin-left: 8rpx;
}

.card-icon-wrap {
  width: 124rpx;
  height: 124rpx;
}

.card-icon {
  width: 100%;
  height: 100%;
}

// 商家星级
.store-stars {
  position: relative;

  .store-stars-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    border-radius: 16rpx;
  }

  .stars-chart {
    position: relative;
    border-radius: 16rpx;
    // padding: 86rpx 24rpx 24rpx;
    // margin-top: -24rpx;
  }

  .chart-bg {
    position: absolute;
    left: 212rpx;
    top: 0;
    width: 490rpx;
    height: 86rpx;
  }

  .star-row {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .star-label {
    font-size: 24rpx;
    color: #333;
    width: 60rpx;
  }

  .star-icons {
    display: flex;
    margin-left: 16rpx;

    .star-icon {
      width: 47rpx;
      height: 47rpx;
      margin-right: 8rpx;
    }
  }

  .star-percent {
    margin-left: auto;
    background: #d5ecff;
    border-radius: 27rpx;
    width: 148rpx;
    height: 42rpx;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    &.danger {
      background: #ffe9e5;

      .progress-bar {
        background: #f23212;
      }
    }

    .progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #46b2ff, #1782fc);
      border-radius: 27rpx 0 0 27rpx;
      z-index: 1;
    }

    .percent-num {
      font-size: 24rpx;
      color: #fff;
      position: relative;
      z-index: 10;

      &.blue {
        color: #1782fc;
      }

      &.red {
        color: #f23212;
      }
    }
  }
}

// 商家信息
.store-info {
  .info-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16rpx;

    .info-card {
      position: relative;
      height: 180rpx;
      // width: 208rpx;
      // background: #e5f1ff;
      border-radius: 16rpx;
      // border: 1rpx solid #afd3ff;
      // padding: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;

      .card-icon {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
      }

      .info-title {
        font-size: 26rpx;
        font-weight: 600;
        color: #333;
        text-align: center;
        // margin-top: 16rpx;
        z-index: 1;
        white-space: pre-line;
        flex: 1;
        display: flex;
        align-items: center;
      }

      .info-num {
        display: flex;
        align-items: center;
        margin-top: 8rpx;
        z-index: 1;
        height: 76rpx;
      }

      .num {
        font-size: 32rpx;
        font-weight: 500;
        color: #1782fc;
        line-height: 40rpx;
      }

      .unit {
        font-size: 24rpx;
        color: #333;
        margin-left: 8rpx;
        line-height: 40rpx;
      }
    }
  }
}

// 最新资讯
.news {
  .news-list {
    display: flex;
    flex-direction: column;
  }

  .news-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
  }

  .news-thumb {
    width: 58rpx;
    height: 58rpx;
  }

  .news-title {
    flex: 1;
    font-size: 26rpx;
    color: #333;
    margin-left: 16rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .news-arrow {
    // width: 24rpx;
    // height: 24rpx;
    margin-left: 16rpx;
  }

  .view-more {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90rpx;

    .more-text {
      font-size: 24rpx;
      color: #000;
    }

    .more-arrow {
      margin-left: 8rpx;
    }
  }
}

// 监管声明
.supervision-declaration {
  text-align: center;
  padding: 28rpx 0 68rpx;

  .declaration-text {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
