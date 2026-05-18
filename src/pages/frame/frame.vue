<template>
  <view>
    <web-view v-if="externalLink" :src="externalLink" />
  </view>
</template>

<script setup lang="ts">
const externalLink = ref('');

onLoad(options => {
  externalLink.value = decodeURIComponent(options.link);
  console.log(externalLink.value);

  //设置页面标题
  if (options.title) {
    uni.setNavigationBarTitle({
      title: options.title
    });
  }
});
</script>
