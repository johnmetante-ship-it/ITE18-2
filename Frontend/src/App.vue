<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from './stores/booking'
import AppHeader from './components/AppHeader.vue'
import WebNav from './components/WebNav.vue'
import MobileShell from './components/MobileShell.vue'
import AppToast from './components/AppToast.vue'

const store = useBookingStore()
const router = useRouter()

function refreshIcons() {
  requestAnimationFrame(() => window.lucide?.createIcons?.())
}

onMounted(refreshIcons)
router.afterEach(refreshIcons)
watch(() => store.mode, () => refreshIcons())
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="web-stage mx-auto p-5">
      <section v-if="store.mode === 'desktop'" class="web-page bg-white rounded-[30px] overflow-hidden shadow-xl shadow-blue-950/10">
        <WebNav />
        <router-view v-slot="{ Component }">
          <transition name="view" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </section>
      <MobileShell v-else />
    </main>
    <AppToast />
  </div>
</template>
