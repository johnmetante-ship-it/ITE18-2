import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookingStore = defineStore('booking', () => {
  const destinations = ref([
    { id: 'mayapay', name: 'Mount Mayapay', category: 'Adventure', img: 'https://images.pexels.com/photos/12029295/pexels-photo-12029295.jpeg?auto=compress&cs=tinysrgb&w=800', overview: 'A 675-meter mountain east of Butuan City with wide views over the Agusan Valley. Its name is linked to the ancient Majapahit Empire that once influenced the region.', activities: 'Viewpoint hike · Sunrise trek', host: 'Hosted by local trek guides in Butuan City.', price: 'from ₱450 / guest' },
    { id: 'bood', name: 'Bood Promontory Eco Park', category: 'Nature', img: 'https://images.pexels.com/photos/27138224/pexels-photo-27138224.jpeg?auto=compress&cs=tinysrgb&w=800', overview: 'A historic wooded hill in Barangay Pinamanculan believed to be where Magellan\'s men celebrated the first Catholic Mass on Philippine soil in 1521, overlooking Butuan Bay and the Masao River.', activities: 'Heritage walk · Tree park stroll', host: 'Managed by the Butuan City local government.', price: 'from ₱200 / guest' },
    { id: 'balangay', name: 'Balangay Shrine Museum', category: 'Culture', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Golden_Tara_-_panoramio.jpg?width=800', overview: 'The graveyard of Balangay 1, a wooden plank boat dated to 320 AD, plus nine more ancient balangay boats excavated in Barangay Libertad — icons of Butuan\'s seafaring past.', activities: 'Museum tour · Archaeological site visit', host: 'National Museum of the Philippines — Butuan branch.', price: 'from ₱50 / guest' },
    { id: 'agusan-river', name: 'Agusan River Cruise', category: 'Nature', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/MacapagalBridge.jpg?width=800', overview: 'Cruise the Agusan River — the widest and most navigable river in Mindanao — past the cable-stayed Macapagal Bridge and the city\'s riverine communities.', activities: 'River cruise · Bridge sighting · Birdwatching', host: 'Hosted by community river guides in Butuan.', price: 'from ₱600 / guest' },
    { id: 'lake-mainit', name: 'Lake Mainit Eco Escape', category: 'Nature', img: 'https://images.pexels.com/photos/35669317/pexels-photo-35669317.jpeg?auto=compress&cs=tinysrgb&w=800', overview: 'The Philippines\' fourth largest lake (17,060 hectares), shared by Agusan del Norte and Surigao del Norte and ringed by quiet lakeside communities near Jabonga.', activities: 'Lakeside walk · Community visit', host: 'Hosted by lakeside communities in Jabonga.', price: 'from ₱500 / guest' },
    { id: 'palagsing', name: 'Palagsing & Unaw Food Trail', category: 'Food', img: 'https://images.pexels.com/photos/36499543/pexels-photo-36499543.jpeg?auto=compress&cs=tinysrgb&w=800', overview: 'Taste palagsing — a chewy delicacy of lumbiya (sago) starch, young coconut, and brown sugar wrapped in banana leaves — and other unaw-based treats in old Banza, Butuan.', activities: 'Food tasting · Market walk', host: 'Hosted by Banza food makers in Butuan.', price: 'from ₱350 / guest' },
  ])

  const detailImages = {
    main: 'https://images.pexels.com/photos/12029295/pexels-photo-12029295.jpeg?auto=compress&cs=tinysrgb&w=1280',
    second: 'https://commons.wikimedia.org/wiki/Special:FilePath/MacapagalBridge.jpg?width=800',
    third: 'https://commons.wikimedia.org/wiki/Special:FilePath/Guingona_Park_Butuan.jpg?width=800',
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

  function clearFilters() {
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
    clearFilters,
  }
})
