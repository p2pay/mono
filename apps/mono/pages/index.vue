<template>
  <main style="padding: 24px; font-family: ui-sans-serif, system-ui;">
    <h1>@p2payto/mono standalone app</h1>

    <p>Root API says: <strong>{{ data?.message }}</strong></p>

    <ul>
      <li>
        <NuxtLink to="/mono">/mono (module injected)</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/rails/template">/rails/template (rail injected)</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/rails/peach">/rails/peach (rail injected)</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/flows/booking">/flows/booking (booking flow)</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/flows/booking/embed?customMode=dark&customPrimary=0ea5e9&customBackground=0b1220">
          /flows/booking/embed (themed embed)</NuxtLink>
      </li>
    </ul>

    <p><small>Source: <code>/api/index</code></small></p>
  </main>
</template>

<script setup>
const { data } = await useFetch('/api/index')
</script>
