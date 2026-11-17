import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: () => (useAuthStore().isRegistered ? '/home' : '/welcome'),
  },
  { path: '/welcome', name: 'welcome', component: () => import('../views/WelcomeView.vue'), meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue'), meta: { guestOnly: true } },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { guestOnly: true } },
  { path: '/home', name: 'home', component: () => import('../views/HomeView.vue'), meta: { requiresAuth: true } },
  { path: '/explore', name: 'explore', component: () => import('../views/ExploreView.vue'), meta: { requiresAuth: true } },
  { path: '/detail/:id', name: 'detail', component: () => import('../views/DetailView.vue'), meta: { requiresAuth: true } },
  { path: '/booking', name: 'booking', component: () => import('../views/BookingView.vue'), meta: { requiresAuth: true } },
  { path: '/confirmation', name: 'confirmation', component: () => import('../views/ConfirmationView.vue'), meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isRegistered) {
    return { name: 'welcome' }
  }
  if (to.meta.guestOnly && auth.isRegistered) {
    return { name: 'home' }
  }
})

export default router
