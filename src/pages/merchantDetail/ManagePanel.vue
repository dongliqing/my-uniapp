<template>
    <view class="manage">

        <!-- ============ 商家得分 ============ -->
        <view class="manage__score-section">
            <!-- 标题行 -->
            <view class="manage__score-header">
                <view class="manage__score-title">
                    <text style="margin-right: 12rpx;">商家得分</text>
                    <StarRating :value="4" />

                </view>

                <view class="manage__score-stars-row">

                    <text class="manage__score-num-inline">86.9分</text>
                </view>
            </view>

            <!-- 雷达图 + 标注布局 -->
            <view class="manage__radar-layout">
                <!-- 左侧标注列：卫生环境 / 合规经营 -->
                <view class="manage__radar-side manage__radar-side--left">
                    <view class="manage__dim-label">
                        <text class="manage__dim-name">卫生环境</text>
                        <view class="manage__dim-score-row">
                            <image class="manage__dim-dot" src="/static/images/svg/merchantDetail/25.svg"
                                mode="aspectFit" />
                            <text class="manage__dim-score">75分</text>
                        </view>
                    </view>
                    <view class="manage__dim-label">
                        <text class="manage__dim-name">合规经营</text>
                        <view class="manage__dim-score-row">
                            <image class="manage__dim-dot" src="/static/images/svg/merchantDetail/25.svg"
                                mode="aspectFit" />
                            <text class="manage__dim-score">88分</text>
                        </view>
                    </view>
                </view>

                <!-- 中间：canvas画布 + 顶部食品安全标注 -->
                <view class="manage__radar-center">
                    <!-- 顶部：食品安全 -->
                    <view class="manage__dim-label manage__dim-label--center">
                        <text class="manage__dim-name">食品安全</text>
                        <view class="manage__dim-score-row">
                            <image class="manage__dim-dot" src="/static/images/svg/merchantDetail/25.svg"
                                mode="aspectFit" />
                            <text class="manage__dim-score">92分</text>
                        </view>
                    </view>
                    <!-- Canvas 雷达图 -->
                    <canvas canvas-id="radarChart" class="manage__canvas" />
                </view>

                <!-- 右侧标注列：社会责任 / 消费评价 -->
                <view class="manage__radar-side manage__radar-side--right">
                    <view class="manage__dim-label">
                        <text class="manage__dim-name">社会责任</text>
                        <view class="manage__dim-score-row">
                            <image class="manage__dim-dot" src="/static/images/svg/merchantDetail/25.svg"
                                mode="aspectFit" />
                            <text class="manage__dim-score">60分</text>
                        </view>
                    </view>
                    <view class="manage__dim-label">
                        <text class="manage__dim-name">消费评价</text>
                        <view class="manage__dim-score-row">
                            <image class="manage__dim-dot" src="/static/images/svg/merchantDetail/25.svg"
                                mode="aspectFit" />
                            <text class="manage__dim-score">90分</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

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
                    <image class="manage__section-bar" src="/static/images/svg/merchantDetail/title_line.svg"
                        mode="aspectFit" />
                    <text class="manage__section-title">商家亮点</text>
                </view>
                <view class="manage__highlight-item">
                    <image class="manage__highlight-icon" src="/static/images/svg/merchantDetail/high_comment.svg"
                        mode="aspectFit" />
                    <text class="manage__highlight-label">维度名称</text>
                    <text class="manage__highlight-content">这里是评分项目内容</text>
                </view>
                <view class="manage__highlight-divider" />
                <view class="manage__highlight-item">
                    <image class="manage__highlight-icon" src="/static/images/svg/merchantDetail/high_comment.svg"
                        mode="aspectFit" />
                    <text class="manage__highlight-label">维度名称</text>
                    <text class="manage__highlight-content">这里是评分项目内容</text>
                </view>
            </view>
            <!-- ============ 警示信息 ============ -->
            <view class="manage__highlight-card">
                <view class="manage__card-header">
                    <image class="manage__section-bar" src="/static/images/svg/merchantDetail/title_line.svg"
                        mode="aspectFit" />
                    <text class="manage__section-title">警示信息</text>
                </view>
                <view class="manage__warning-row">
                    <view v-for="item in warningItems" :key="item.label" class="manage__warning-item"
                        :class="item.count > 0 ? 'manage__warning-item--red' : 'manage__warning-item--blue'">
                        <image class="manage__warning-svg" :src="item.count > 0
                            ? '/static/images/svg/merchantDetail/abnormal_indicator.svg'
                            : '/static/images/svg/merchantDetail/abnormal_success.svg'" mode="aspectFit" />
                        <view>
                            <view class="manage__warning-label">{{ item.label }}</view>
                            <view class="manage__warning-count"
                                :class="item.count > 0 ? 'manage__warning-count--red' : 'manage__warning-count--blue'">
                                {{ item.count }}</view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- ============ 指标异常 ============ -->
            <view class="manage__highlight-card">
                <view class="manage__card-header">
                    <image class="manage__section-bar" src="/static/images/svg/merchantDetail/title_line.svg"
                        mode="aspectFit" />
                    <text class="manage__section-title">指标异常</text>
                </view>
                <view class="manage__abnormal-row">
                    <image class="manage__abnormal-icon" src="/static/images/svg/merchantDetail/exception.svg"
                        mode="aspectFit" />
                    <text class="manage__abnormal-text">社会责任指标得分较低</text>
                </view>
            </view>
        </view>

        <!-- ============ 原材料看台 ============ -->
        <view class="manage__gallery-section">
            <text class="manage__gallery-title">原材料看台</text>
            <scroll-view class="manage__gallery-scroll" scroll-x>
                <view class="manage__gallery-list">
                    <view v-for="(img, i) in rawImages" :key="i" class="manage__gallery-item"
                        @tap="previewGallery(rawImages, i)">
                        <image class="manage__gallery-img" :src="img" mode="aspectFill" />
                    </view>
                </view>
            </scroll-view>
        </view>

    </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import StarRating from '@/components/StarRating.vue'

// ==================== 警示信息 ====================
const warningItems = [
    { label: '年度投诉', count: 12 },
    { label: '年度处罚', count: 0 },
    { label: '异常事件', count: 0 },
]

// ==================== 图片数据 ====================
const rawImages = [
    '/static/images/svg/merchantDetail/48.png',
    '/static/images/svg/merchantDetail/48.png',
    '/static/images/svg/merchantDetail/48.png',
]


function previewGallery(urls: string[], current: number) {
    uni.previewImage({ current: urls[current], urls })
}

// ==================== 雷达图 ====================
/**
 * 五维度定义 - 顶点顺序按五边形顶点，从正上方(270°)开始顺时针：
 *   0: 食品安全 (顶)      270° → -90°
 *   1: 社会责任 (右上)    270°+72° = 342° → -18°
 *   2: 消费评价 (右下)    270°+144° = 54°
 *   3: 合规经营 (左下)    270°+216° = 126°
 *   4: 卫生环境 (左上)    270°+288° = 198°
 */
const dimensions = [
    { name: '食品安全', score: 92 },
    { name: '社会责任', score: 60 },
    { name: '消费评价', score: 90 },
    { name: '合规经营', score: 88 },
    { name: '卫生环境', score: 75 },
]

onMounted(() => {
    drawRadarChart()
})

function drawRadarChart() {
    const sysInfo = uni.getSystemInfoSync()
    const rpxRatio = sysInfo.windowWidth / 750

    // canvas CSS 边长 = 220rpx → px
    const canvasSize = Math.round(220 * rpxRatio)

    const ctx = uni.createCanvasContext('radarChart')

    const cx = canvasSize / 2
    const cy = canvasSize / 2
    const maxR = canvasSize * 0.38   // 最大半径，留边给数据点
    const levels = 4                  // 网格同心多边形层数
    const n = dimensions.length       // 5
    const startAngle = -Math.PI / 2  // 从顶部270°开始

    /** 计算第 i 个顶点在半径 r 下的坐标 */
    function point(i: number, r: number) {
        const angle = startAngle + (2 * Math.PI / n) * i
        return {
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle),
        }
    }

    // ---- 1. 背景同心多边形网格 ----
    for (let lv = 1; lv <= levels; lv++) {
        const r = maxR * (lv / levels)
        ctx.beginPath()
        for (let i = 0; i < n; i++) {
            const p = point(i, r)
            i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
        }
        ctx.closePath()

        // 最外层略微填充浅蓝
        if (lv === levels) {
            ctx.setFillStyle('rgba(24, 130, 252, 0.05)')
            ctx.fill()
        }
        ctx.setStrokeStyle('rgba(24, 130, 252, 0.2)')
        ctx.setLineWidth(1)
        ctx.stroke()
    }

    // ---- 2. 轴线（中心 → 顶点）----
    for (let i = 0; i < n; i++) {
        const p = point(i, maxR)
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(p.x, p.y)
        ctx.setStrokeStyle('rgba(24, 130, 252, 0.2)')
        ctx.setLineWidth(1)
        ctx.stroke()
    }

    // ---- 3. 数据多边形（填充 + 描边）----
    ctx.beginPath()
    for (let i = 0; i < n; i++) {
        const ratio = dimensions[i].score / 100
        const p = point(i, maxR * ratio)
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
    }
    ctx.closePath()
    ctx.setFillStyle('rgba(24, 130, 252, 0.18)')
    ctx.fill()
    ctx.setStrokeStyle('#1882FC')
    ctx.setLineWidth(2)
    ctx.stroke()

    // ---- 4. 数据顶点小圆圈 ----
    for (let i = 0; i < n; i++) {
        const ratio = dimensions[i].score / 100
        const p = point(i, maxR * ratio)
        // 外白圆
        ctx.beginPath()
        ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI)
        ctx.setFillStyle('#ffffff')
        ctx.fill()
        ctx.setStrokeStyle('#1882FC')
        ctx.setLineWidth(2)
        ctx.stroke()
        // 内蓝圆
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI)
        ctx.setFillStyle('#1882FC')
        ctx.fill()
    }

    ctx.draw()
}
</script>

<style lang="scss" scoped>
.manage {
    background: #F5F5F5;
    padding-bottom: 40rpx;

    // =================== 商家得分 ===================
    &__score-section {
        background: #fff;
        padding: 32rpx 24rpx 24rpx;
        margin-bottom: 20rpx;
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
        color: #1882FC;
        line-height: 1;
    }

    &__score-unit {
        font-size: 24rpx;
        font-weight: 500;
        color: #1882FC;
    }

    &__score-stars-row {
        display: flex;
        align-items: center;
        gap: 8rpx;
    }

    &__score-num-inline {
        font-size: 26rpx;
        color: #1882FC;
        font-weight: 500;
    }

    // 雷达图三列布局
    &__radar-layout {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8rpx;
    }

    &__radar-side {
        display: flex;
        flex-direction: column;
        gap: 48rpx;
        flex-shrink: 0;

        &--left {
            align-items: flex-end;
        }

        &--right {
            align-items: flex-start;
        }
    }

    &__radar-center {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        min-width: 0;
    }

    &__canvas {
        width: 220rpx;
        height: 220rpx;
        display: block;
    }

    // 维度标注
    &__dim-label {
        display: flex;
        flex-direction: column;
        gap: 4rpx;

        &--center {
            align-items: center;
            margin-bottom: 8rpx;
        }
    }

    &__dim-name {
        font-size: 22rpx;
        color: #333;
        text-align: center;
    }

    &__dim-score-row {
        display: flex;
        align-items: center;
        gap: 4rpx;
    }

    &__dim-dot {
        width: 18rpx;
        height: 18rpx;
        flex-shrink: 0;
    }

    &__dim-score {
        font-size: 22rpx;
        color: #1882FC;
    }

    // =================== 通用卡片 ===================
    &__card {
        background: #fff;
        border-radius: 16rpx;
        padding: 24rpx;
        margin-top: 24rpx
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
    }

    &__badge-tag {
        display: flex;
        align-items: center;
        gap: 8rpx;
        background: #FFF3E1;
        border: 1rpx solid #EFCE9C;
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
        color: #B2823A;
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
            background: linear-gradient(0deg, #FFE3E3 0%, #ffffff 100%);
            border: 1rpx solid #FF8587;
        }

        &--blue {
            background: linear-gradient(0deg, #D0E5FE 0%, #ffffff 100%);
            border: 1rpx solid #82BBFF;
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
            background: #D9D9D9;
        }
    }

    &__warning-svg {
        width: 62rpx;
        height: 62rpx;
    }

    &__warning-exclamation {
        font-size: 32rpx;
        font-weight: 700;
        color: #F21212;
    }

    &__warning-label {
        font-size: 24rpx;
        color: #333;
    }

    &__warning-count {
        font-size: 26rpx;
        font-weight: 500;

        &--red {
            color: #F23212;
        }

        &--blue {
            color: #1782FC;
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
        padding: 24rpx;
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
        background: #D9D9D9;
        flex-shrink: 0;
    }

    &__gallery-img {
        width: 100%;
        height: 100%;
    }
}
</style>
