<template>
  <image :src="imageUrl" :mode="mode" class="a-image" />
</template>
<script lang="ts" setup>
import { getFileApi } from '@/api/common.ts';

const props = withDefaults(
  defineProps<{
    fileId: string;
    mode?: string;
    type?: string; //图片格式
  }>(),
  {
    fileId: '',
    mode: 'aspectFill',
    type: 'image/jpeg'
  }
);

const imageUrl = ref('');
const tempFilePath = ref('');

watch(
  () => props.fileId,
  async newValue => {
    if (newValue) {
      //下载图片资源
      const arrayBuffer = await getFileApi(newValue);
      // 将 ArrayBuffer 转换为 Base64 字符串
      const base64Data = uni.arrayBufferToBase64(arrayBuffer);
      const url = `data:${props.type || 'image/jpeg'};base64,${base64Data}`;
      // console.log('----', url)

      imageUrl.value = url as string;
      getTempFilePath(arrayBuffer as ArrayBuffer);
    } else {
      imageUrl.value = '';
    }
  },
  { immediate: true }
);

const getTempFilePath = (arrayBuffer: ArrayBuffer) => {
  // #ifdef H5
  const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
  tempFilePath.value = URL.createObjectURL(blob);
  // #endif
  // #ifndef H5
  const fs = uni.getFileSystemManager();
  // 生成一个唯一的临时文件名
  const random = Math.floor(Math.random() * 900) + 100;
  const tempPath = `${wx.env.USER_DATA_PATH}/temp_image_${Date.now()}_${random}.jpg`;
  fs.writeFile({
    filePath: tempPath,
    data: arrayBuffer,
    encoding: 'binary',
    success: () => {
      tempFilePath.value = tempPath;
    }
  });
  // #endif
};

onUnmounted(() => {
  if (tempFilePath.value) {
    // #ifdef H5
    // H5 端释放 blob 内存
    URL.revokeObjectURL(tempFilePath.value);
    // #endif

    // #ifndef H5
    // 小程序 / App 端删除本地文件
    const fs = uni.getFileSystemManager();
    fs.unlink({ filePath: tempFilePath.value });
    // #endif
  }
});

defineExpose({
  tempFilePath
});
</script>
<style scoped lang="scss">
.a-image {
  width: 100%;
  height: 100%;
}
</style>
