import { createRouter } from 'uni-simple-router'

// 路由配置
export const router = createRouter({
  platform: process.env.VUE_APP_PLATFORM,
  routes: [
    {
      path: '/pages/index/index',
      name: 'home',
      meta: { title: '首页', requiresAuth: false }
    },
    {
      path: '/pages/storeList/storeList',
      name: 'storeList',
      meta: { title: '商家列表', requiresAuth: true }
    },
    {
      path: '/pages/storeDetail/storeDetail',
      name: 'storeDetail',
      meta: { title: '商家详情', requiresAuth: true }
    },
    {
      path: '/pages/login/login',
      name: 'login',
      meta: { title: '登录', requiresAuth: false }
    }
  ]
})

// 检查登录状态（示例函数，你需要根据实际逻辑实现）
const checkLoginStatus = (): boolean => {
  // 这里可以从 storage 中获取登录状态
  const token = uni.getStorageSync('user_token')
  return !!token
}

// 全局前置守卫
router.beforeEach((to, from, next) => {
  console.log(`路由跳转: ${from.path} -> ${to.path}`)
  
  // 如果需要认证但未登录，跳转到登录页
  if (to.meta.requiresAuth && !checkLoginStatus()) {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    })
    
    // 跳转到登录页，并携带重定向路径
    next({
      name: 'login',
      query: { 
        redirect: to.fullPath 
      }
    })
  } else {
    // 允许跳转
    next()
  }
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 可以在这里设置页面标题
  if (to.meta.title) {
    uni.setNavigationBarTitle({
      title: to.meta.title as string
    })
  }
})

export default router