import { createRouter } from 'uni-mini-router'

// 路由定义 (这里的 path 将会被 UniPages 插件映射)
const routes = [
  {
    path: '/pages/index/index',
    name: 'home'
  },
  {
    path: '/pages/login/login',
    name: 'login'
  },
  {
    path: '/pages/merchantList/index',
    name: 'merchantList',
    meta: {
      title: '商家列表',
      keepAlive: true
    }
  },
  {
    path: '/pages/storeList/storeList',
    name: 'storeList',
    meta: {
      title: '商家列表',
      keepAlive: true
    }
  },
  {
    path: '/pages/storeDetail/storeDetail',
    name: 'storeDetail'
  },
  {
    path: '/pages/rank/index',
    name: 'redBlackRank',
    meta: {
      title: '红黑榜单'
    }
  },
  {
    path: '/pages/check/index',
    name: 'check',
    meta: {
      title: '你点我查'
    }
  }
]

// 路由配置
const router = createRouter({
  routes
})

// 检查登录状态
const checkLoginStatus = (): boolean => {
  const token = uni.getStorageSync('user_token')
  return !!token
}

// 全局前置守卫
router.beforeEach((to, from, next) => {
  console.log('路由跳转 from:', from)
  console.log('路由跳转 to:', to)

  if (!to) {
    return next()
  }

  // 需要登录的页面 (使用 name 匹配更稳健)
  const authPages = ['storeList', 'storeDetail']
  const isAuthRequired = authPages.includes(to.name as string)

  // if (isAuthRequired && !checkLoginStatus()) {
  //   uni.showToast({
  //     title: '请先登录',
  //     icon: 'none',
  //     duration: 2000,
  //   });

  //   return next({
  //     name: 'login',
  //     query: {
  //       redirect: to.fullPath || (to.path as string),
  //     },
  //     navType: 'push',
  //   });
  // }

  next()
})

export default router
