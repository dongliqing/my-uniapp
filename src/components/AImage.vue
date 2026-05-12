<template>
  <image :src="imageUrl" :mode="mode" />
</template>
<script lang="ts" setup>
import { getFileApi } from '@/api/common.ts'

const props = withDefaults(
  defineProps<{
    fileId: string
    mode?: string
    type?: string //图片格式
  }>(),
  {
    fileId: '',
    mode: 'aspectFill',
    type: 'image/jpeg'
  }
)

const imageUrl = ref('')

watch(
  () => props.fileId,
  async newValue => {
    if (newValue) {
      //下载图片资源
      const url = await getFileApi(newValue, props.type)
      console.log('----', url)

      imageUrl.value = url as string
    } else {
      imageUrl.value = ''
    }
  },
  { immediate: true }
)
</script>
<style scoped lang="scss"></style>
