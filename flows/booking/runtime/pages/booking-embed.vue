<script setup>
const route = useRoute()

const customMode = computed(() => {
  const raw = Array.isArray(route.query.customMode) ? route.query.customMode[0] : route.query.customMode
  return raw === 'dark' ? 'dark' : 'light'
})

const customPrimary = computed(() => {
  const raw = Array.isArray(route.query.customPrimary) ? route.query.customPrimary[0] : route.query.customPrimary
  return normalizeThemeColor(raw, '#3b82f6')
})

const customBackground = computed(() => {
  const raw = Array.isArray(route.query.customBackground) ? route.query.customBackground[0] : route.query.customBackground
  return normalizeThemeColor(raw, '#ffffff')
})
</script>

<template>
  <div :style="{ minHeight: '100vh', backgroundColor: customBackground }">
    <BookingFlowView :custom-mode="customMode" :custom-primary="customPrimary" :custom-background="customBackground" />
  </div>
</template>
