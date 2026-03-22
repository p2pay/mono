<script setup>
import { CalendarDate } from '@internationalized/date'
import { shallowRef } from 'vue'

const props = defineProps({
  customMode: {
    type: String,
    default: 'light'
  },
  customPrimary: {
    type: String,
    default: '#3b82f6'
  },
  customBackground: {
    type: String,
    default: '#ffffff'
  }
})

const selectedDate = shallowRef(new CalendarDate(2026, 3, 22))

const { isDark, themeStyles } = useCustomTheme({
  mode: () => props.customMode,
  primary: () => props.customPrimary,
  background: () => props.customBackground
})
</script>

<template>
  <div class="rounded-lg p-2" :class="{ dark: isDark }" :style="themeStyles">
    <UCalendar v-model="selectedDate" color="primary" class="w-full" />
  </div>
</template>
