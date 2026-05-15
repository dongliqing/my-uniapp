<template>
  <view class="preview-images-contain">
    <view class="single-image" v-for="(fileId, index) in fileIds" :key="fileId + index" @click="handleClick(index)">
      <AImage ref="singleImageRef" :fileId="fileId" :type="type" :mode="mode" />
    </view>
  </view>
</template>
<script lang="ts" setup>
import AImage from './AImage.vue';

const props = withDefaults(
  defineProps<{
    fileIds: string[];
    mode?: string;
    type?: string; //图片格式
  }>(),
  {
    fileIds: () => [],
    mode: 'aspectFill',
    type: 'image/jpeg'
  }
);

const singleImageRef = ref<typeof AImage>();

const handleClick = (index: number) => {
  // singleImageRef.value?.preview(index);
  const targetPath = singleImageRef.value[index].tempFilePath;
  const allPaths = singleImageRef.value.map(item => item.tempFilePath);
  uni.previewImage({
    current: targetPath,
    urls: allPaths,
    complete: () => {}
  });
};
</script>
<style scoped lang="scss">
.single-image {
  width: 100rpx;
  height: 100rpx;
}
</style>
