<template>
    <view class="star-rating">
        <image
            v-for="n in 5"
            :key="n"
            class="star-rating__star"
            :src="n <= Math.floor(value) ? activeIcon : defaultIcon"
            mode="aspectFit"
        />
        <!-- 半星 -->
        <view v-if="value % 1 !== 0" class="star-rating__half-wrap">
            <image
                class="star-rating__star star-rating__star--half"
                :src="activeIcon"
                mode="aspectFit"
            />
        </view>
    </view>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    /** 星级，支持小数（如 4.5） */
    value: number
    /** 激活状态图标路径 */
    activeIcon?: string
    /** 默认（未激活）图标路径 */
    defaultIcon?: string
    /** 单颗星尺寸（rpx），默认 28 */
    size?: number
}>(), {
    activeIcon: '/static/images/svg/star-active.svg',
    defaultIcon: '/static/images/svg/star-default.svg',
    size: 28
})
</script>

<style lang="scss" scoped>
.star-rating {
    display: flex;
    align-items: center;
    gap: 2rpx;

    &__star {
        width: v-bind('size + "rpx"');
        height: v-bind('size + "rpx"');
    }

    &__half-wrap {
        overflow: hidden;
        width: v-bind('Math.ceil(size / 2) + "rpx"');
        height: v-bind('size + "rpx"');
    }

    /* &__star--half 宽度仍是整颗星，通过父容器 overflow:hidden 截半 */
}
</style>
