import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/explore', name: 'explore', component: () => import('../views/ExploreView.vue') },
  { path: '/detail/:id', name: 'detail', component: () => import('../views/DetailView.vue') },
  { path: '/booking', name: 'booking', component: () => import('../views/BookingView.vue') },
  { path: '/confirmation', name: 'confirmation', component: () => import('../views/ConfirmationView.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
