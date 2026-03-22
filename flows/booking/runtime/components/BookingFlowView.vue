<script setup>
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

const form = reactive({
  bookingName: '',
  bookingEmail: '',
  bookingDetails: '',
  timeSlot: '09:00-10:00'
})

const selectedExtras = ref([])
const extras = [
  { label: 'Priority confirmation (+10%)', value: 'priority' },
  { label: 'Follow-up summary (+5%)', value: 'summary' },
  { label: 'Recording link (+15%)', value: 'recording' }
]

const timeSlots = [
  '09:00-10:00',
  '10:00-11:00',
  '14:00-15:00',
  '16:00-17:00'
]

const { isDark, themeStyles } = useCustomTheme({
  mode: () => props.customMode,
  primary: () => props.customPrimary,
  background: () => props.customBackground
})

const subtotal = computed(() => {
  const base = 120
  const extraMap = {
    priority: 12,
    summary: 6,
    recording: 18
  }

  return selectedExtras.value.reduce((sum, item) => sum + (extraMap[item] || 0), base)
})
</script>

<template>
  <div class="min-h-screen p-4 sm:p-8" :class="{ dark: isDark }" :style="themeStyles">
    <div class="mx-auto w-full max-w-7xl space-y-6">
      <UCard>
        <template #header>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 class="text-2xl font-bold">Booking Flow</h1>
              <p class="text-sm text-muted">No login required. Buyer can book directly.</p>
            </div>
            <UBadge color="primary" variant="subtle">Nuxt UI</UBadge>
          </div>
        </template>
        <p class="text-sm text-muted">Customize style with query params: <strong>customMode</strong>,
          <strong>customPrimary</strong>, <strong>customBackground</strong>.
        </p>
      </UCard>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Buyer Details</h2>
          </template>

          <div class="space-y-4">
            <UFormField label="Name">
              <UInput v-model="form.bookingName" placeholder="Satoshi Nakamoto" />
            </UFormField>

            <UFormField label="Email">
              <UInput v-model="form.bookingEmail" type="email" placeholder="you@example.com" />
            </UFormField>

            <UFormField label="Details">
              <UTextarea v-model="form.bookingDetails" :rows="4"
                placeholder="What do you want to cover in this booking?" />
            </UFormField>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Select Date</h2>
          </template>

          <BookingCalendar :custom-mode="props.customMode" :custom-primary="props.customPrimary"
            :custom-background="props.customBackground" />
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Select Time & Extras</h2>
          </template>

          <div class="space-y-4">
            <UFormField label="Time slot">
              <USelect v-model="form.timeSlot" :items="timeSlots" />
            </UFormField>

            <UFormField label="Extras">
              <USelectMenu v-model="selectedExtras" :items="extras" value-key="value" label-key="label" multiple
                placeholder="Choose optional extras" />
            </UFormField>

            <div class="rounded-md border border-default p-3">
              <p class="text-sm text-muted">Estimated total</p>
              <p class="text-2xl font-bold">${{ subtotal }}</p>
            </div>

            <UButton color="primary" block>Continue to Payment</UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
