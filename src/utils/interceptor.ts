// 定义不需要登录就能访问的白名单页面
const whiteList: string[] = ['/pages/login/login', '/pages/register/register'];

// 核心校验逻辑
function checkAuth(url: string): boolean {
  // 截取纯路径，忽略 ? 后面的参数
  const path = url.split('?')[0];
  // 白名单直接放行
  if (whiteList.includes(path)) {
    return true;
  }
  const openid = uni.getStorageSync('openid');
  const userInfo = uni.getStorageSync('userInfo');
  console.log('openid:', openid);
  return !!openid && !!userInfo;
}

export function pageInterceptor(url: string) {
  // 校验通过，正常跳转
  if (checkAuth(url)) {
    return true;
  }

  uni.redirectTo({
    url: `/pages/login/login?redirect=${encodeURIComponent(url)}`
  });
  return false;
}

// 拦截器配置
const routeInterceptor: UniApp.InterceptorOptions = {
  invoke(args) {
    console.log('args', args.url);
    return pageInterceptor(args.url);
  }
};

// 注册所有路由拦截
export function initRouteGuard() {
  console.log('=== 拦截器开始注册 ===');
  uni.addInterceptor('navigateTo', routeInterceptor);
  uni.addInterceptor('redirectTo', routeInterceptor);
  uni.addInterceptor('reLaunch', routeInterceptor);
  uni.addInterceptor('switchTab', routeInterceptor);
}
