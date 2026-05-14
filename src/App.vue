<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
import { initRouteGuard, pageInterceptor } from '@/utils/interceptor.ts';
onLaunch(options => {
  console.log('App Launch', options);

  const currentPage = options.path || 'pages/index/index';
  pageInterceptor('/' + currentPage);
  initRouteGuard();
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>
<style></style>
