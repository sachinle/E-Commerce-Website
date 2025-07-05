import { createRouter, createWebHashHistory } from 'vue-router'

import WelcomePage from '@/components/WelcomePage.vue'
import ProductList from '@/components/ProductList.vue'
import CartPage from '@/components/CartPage.vue'
import ProductDetail from '@/components/ProductDetail.vue'
import PaymentPage from '@/components/PaymentPage.vue'
import OrderConfirmation from '@/components/OrderConfirmation.vue'

const routes = [
  {
    path: '/',
    name: 'WelcomePage',
    component: WelcomePage
  },
  {
    path: '/product-list',
    name: 'ProductList',
    component: ProductList
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/cart',
    name: 'CartPage',
    component: CartPage
  },
  {
    path: '/payment',
    name: 'PaymentPage',
    component: PaymentPage
  },
  {
    path: '/order-confirmation',
    name: 'OrderConfirmation',
    component: OrderConfirmation,
    props: route => ({ amount: route.query.amount || '0.00' })
  }
]

const router = createRouter({
  history: createWebHashHistory(), // 🔧 Use hash mode for GitHub Pages
  routes
})

export default router
