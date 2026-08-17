<template>
  <header class="header">
    <div class="title">
      🌳 Quinta Arcángeles
    </div>

    <div class="header-side">
      <div
        v-if="todayWeather"
        class="today-weather"
      >
        <span class="weather-icon">
          {{ weatherIcon(todayWeather.code) }}
        </span>

        <div>
          <div class="weather-now">
            {{ currentTemperature }}°
          </div>

          <div class="weather-range">
            ↑ {{ Math.round(todayWeather.max) }}° · ↓ {{ Math.round(todayWeather.min) }}°
          </div>
        </div>
      </div>

      <div class="datetime">
        <div class="time">{{ time }}</div>
        <div class="date">{{ date }}</div>
      </div>
    </div>
  </header>
</template>

<script setup>
import {
  computed,
  ref,
  onMounted,
  onUnmounted
} from "vue"
import {
  dailyWeatherForDate,
  weatherIcon
} from "../utils/weather"

const props = defineProps({
  forecast:{
    type:Object,
    default:null
  }
})

const time = ref("")
const date = ref("")

let timer

const todayWeather = computed(() =>
  dailyWeatherForDate(
    props.forecast,
    new Date()
  )
)

const currentTemperature = computed(() => {

  const current =
    props.forecast?.current?.temperature_2m

  if(Number.isFinite(current))
    return Math.round(current)

  if(todayWeather.value)
    return Math.round(
      (todayWeather.value.max + todayWeather.value.min) / 2
    )

  return "--"

})

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

<style scoped>
.header-side{

  display:flex;
  align-items:center;
  justify-content:flex-end;
  gap:24px;

}

.today-weather{

  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 14px;
  border:1px solid #304050;
  border-radius:12px;
  background:#1d2935;
  box-shadow:0 6px 18px rgba(0,0,0,.2);

}

.weather-icon{

  font-size:30px;
  line-height:1;

}

.weather-now{

  font-size:28px;
  line-height:1;
  font-weight:800;

}

.weather-range{

  margin-top:4px;
  color:#b6c4d1;
  font-size:15px;
  font-weight:700;
  white-space:nowrap;

}

@media (max-width: 900px){

  .header-side{
    gap:12px;
  }

  .today-weather{
    padding:8px 10px;
  }

  .weather-range{
    display:none;
  }

}
</style>
