<template>
  <view class="preview-image" :class="[`preview-image--cols-${columns}`]">
    <view v-for="(fileId, index) in fileIds" :key="fileId + index" class="preview-image__item" @click="handleClick(index)">
      <AImage ref="imageRefs" :fileId="fileId" :type="type" :mode="mode" />
    </view>

    <view v-if="!fileIds.length" class="preview-image__empty">
      <text class="preview-image__empty-text">{{ emptyText }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import AImage from './AImage.vue';

const props = withDefaults(
  defineProps<{
    fileIds: string[];
    mode?: string;
    type?: string;
    /** 每行列数，默认 3 */
    columns?: number;
    /** 空状态文案 */
    emptyText?: string;
  }>(),
  {
    fileIds: () => [],
    mode: 'aspectFill',
    type: 'image/jpeg',
    columns: 3,
    emptyText: '暂无图片'
  }
);

const imageRefs = ref<InstanceType<typeof AImage>[] | null>(null);

function handleClick(index: number) {
  if (!imageRefs.value?.length) return;
  const targetPath = imageRefs.value[index].tempFilePath as string;
  const allPaths = imageRefs.value.map(item => item.tempFilePath) as string[];
  uni.previewImage({
    current: targetPath,
    urls: allPaths
  });
}
</script>

<style scoped lang="scss">
.preview-image {
  display: grid;
  gap: 12rpx;

  &--cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  &--cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  &--cols-5 {
    grid-template-columns: repeat(5, 1fr);
  }

  &__item {
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 10rpx;
  }

  &__empty {
    grid-column: 1 / -1;
    padding: 24rpx 0;
    text-align: center;
  }

  &__empty-text {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
