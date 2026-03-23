<script setup>
const limits = ref(null)
const robot = ref(null)
const offer = ref(null)
const order = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
    const currency = 'EUR'
    const { authorization } = await useRobot()

    limits.value = await $fetch('/api/flows/robosats/limits', {
      query: { currency }
    })

    robot.value = await $fetch('/api/flows/robosats/robot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Robosats-Authorization': authorization,
      },
    })

    offer.value = await $fetch('/api/flows/robosats/offer', {
      method: 'POST',
      body: {
        amount: 50,
        currency,
        paymentMethods: 'Revolut'
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Robosats-Authorization': authorization,
      },
    })

    order.value = await $fetch('/api/flows/robosats/order', {
      query: { id: offer.value.id },
      headers: {
        'X-Robosats-Authorization': authorization,
      },
    })

  } catch (err) {
    error.value = err.message
  }
})
</script>

<template>
  <div>
    <h1>RoboSats Flow</h1>
    <pre v-if="limits">{{ limits }}</pre>
    <pre v-if="robot">{{ robot }}</pre>
    <pre v-if="offer">{{ offer }}</pre>
    <pre v-if="order">{{ order }}</pre>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>
