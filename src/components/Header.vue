<template>
  <header class="header">
    <div class="title">
      🌳 Quinta Arcángeles
    </div>

    <div class="datetime">
      <div class="time">{{ time }}</div>
      <div class="date">{{ date }}</div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"

const time = ref("")
const date = ref("")

let timer

function updateClock() {
  const now = new Date()

  time.value = now.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit"
  })

  date.value = now.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>