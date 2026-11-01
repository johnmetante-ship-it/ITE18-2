import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookingStore = defineStore('booking', () => {
  const destinations = ref([
    { id: 'farm', name: 'Sibagat Farm Stay', category: 'Farm Stay', img: 'https://images.pexels.com/photos/36802871/pexels-photo-36802871.jpeg?auto=compress&cs=tinysrgb&w=800', overview: 'A slow, restorative farm escape with garden walks, simple meals, and a welcoming countryside rhythm.', activities: 'Farm walk · Seedling session', host: 'Hosted by a community farm collective in Caraga.', price: 'from ₱1,200 / guest' },
    { id: 'rice', name: 'Rice Field Trails', category: 'Nature', img: 'https://images.pexels.com/photos/27138224/pexels-photo-27138224.jpeg?auto=compress&cs=tinysrgb&w=800', overview: 'Follow green field paths and learn how local growing seasons shape everyday life.', activities: 'Rice-field tour · Nature walk', host: 'Hosted by a local guide community in Caraga.', price: 'Demo from ₱850 / guest' },
    { id: 'mountain', name: 'Lakewood Mountain View', category: 'Adventure', img: 'https://images.pexels.com/photos/12029295/pexels-photo-12029295.jpeg?auto=compress&cs=tinysrgb&w=800', overview: 'A cool early-morning viewpoint journey for travelers seeking wide landscapes and quiet stories.', activities: 'Viewpoint hike · Picnic stop', host: 'Hosted by an upland guide community in Caraga.', price: 'Demo from ₱950 / guest' },
    { id: 'culture', name: 'Caraga Flavors & Stories', category: 'Food', img: 'https://images.pexels.com/photos/36499543/pexels-photo-36499543.jpeg?auto=compress&cs=tinysrgb&w=800', overview: 'Taste locally inspired dishes and hear stories that celebrate homegrown ingredients.', activities: 'Food tasting · Story circle', host: 'Hosted by a food and culture collective in Caraga.', price: 'Demo from ₱700 / guest' },
    { id: 'culture2', name: 'Community Culture Walk', category: 'Culture', img: 'https://images.pexels.com/photos/27138224/pexels-photo-27138224.jpeg?auto=compress&cs=tinysrgb&w=800', overview: 'A gentle community-led walk centered on craft, connection, and local perspective.', activities: 'Craft visit · Community walk', host: 'Hosted by a cultural community in Caraga.', price: 'Demo from ₱650 / guest' },
  ])

  const detailImages = {
    main: 'https://images.pexels.com/photos/35669317/pexels-photo-35669317.jpeg?auto=compress&cs=tinysrgb&w=1280',
    second: 'https://images.pexels.com/photos/27138224/pexels-photo-27138224.jpeg?auto=compress&cs=tinysrgb&w=800',
    third: 'https://images.pexels.com/photos/36499543/pexels-photo-36499543.jpeg?auto=compress&cs=tinysrgb&w=800',
  }

  const saved = ref(new Set())
  const booked = ref(null)
  const mode = ref('desktop')
  const currentId = ref(null)
  const activeFilter = ref('all')
  const searchQuery = ref('')
  const searchActivity = ref('')

  const toastMsg = ref('')
  const toastVisible = ref(false)
  let toastTimer = null

  const current = computed(() => destinations.value.find((d) => d.id === currentId.value) || destinations.value[0])
  const savedList = computed(() => destinations.value.filter((d) => saved.value.has(d.id)))

  function setMode(m) {
    mode.value = m
  }

  function openDetail(id) {
    currentId.value = id
  }

  function isSaved(id) {
    return saved.value.has(id)
  }

  function toggleSave(id) {
    if (saved.value.has(id)) saved.value.delete(id)
    else saved.value.add(id)
  }

  function confirmBooking(data) {
    booked.value = { ...data }
  }

  function toast(msg) {
    toastMsg.value = msg
    toastVisible.value = true
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toastVisible.value = false
    }, 2200)
  }

  function reset() {
    saved.value = new Set()
    booked.value = null
    currentId.value = null
    activeFilter.value = 'all'
    searchQuery.value = ''
    searchActivity.value = ''
  }

  return {
    destinations,
    detailImages,
    saved,
    booked,
    mode,
    currentId,
    activeFilter,
    searchQuery,
    searchActivity,
    toastMsg,
    toastVisible,
    current,
    savedList,
    setMode,
    openDetail,
    isSaved,
    toggleSave,
    confirmBooking,
    toast,
    reset,
  }
})
