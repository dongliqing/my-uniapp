import { createSSRApp } from 'vue';
import App from './App.vue';
import router from './router/index';

export function createApp() {
  const app = createSSRApp(App);

  // 使用路由
  app.use(router);

  return {
    app,
    router,
  };
}
