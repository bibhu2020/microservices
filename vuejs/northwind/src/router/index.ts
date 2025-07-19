import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import CustomerView from '@/views/customer/CustomerView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import SupplierView from '@/views/supplier/SupplierView.vue'
import CategoryView from '@/views/category/CategoryView.vue'
import ProductView from '@/views/product/ProductView.vue'
import ShipperView from '@/views/shipper/ShipperView.vue'
import OrderView from '@/views/order/OrderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomerView,
    },
    {
      path: '/admin/categories',
      name: 'categories',
      component: CategoryView,
    },
    {
      path: '/admin/products',
      name: 'products',
      component: ProductView,
    },
    {
      path: '/admin/suppliers',
      name: 'suppliers',
      component: SupplierView,
    },
    {
      path: '/admin/shippers',
      name: 'shippers',
      component: ShipperView,
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
