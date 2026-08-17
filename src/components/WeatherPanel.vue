<template>
  <section
    class="card weather"
    :class="{
      focused: props.focused,
      active: props.active
    }"
  >
    <div class="panel-heading">
      <h2>🌤 Clima</h2>
      <span>{{ dateLabel }}</span>
    </div>

    <div
      v-if="selectedWeather"
      class="weather-content"
    >
      <h3>📍 Santiago, Nuevo León</h3>

      <div class="weather-main">
        <div class="weather-range">
          <span>⬆ {{ Math.round(selectedWeather.max) }}°</span>
          <span>⬇ {{ Math.round(selectedWeather.min) }}°</span>
        </div>

        <div class="weather-label">
          {{ weatherCodeLabel(selectedWeather.code) }}
        </div>
      </div>

      <div
        v-if="isToday && currentTemperature !== null"
        class="current-weather"
      >
        <span>Ahora</span>
        <strong>{{ currentTemperature }} °C</strong>
      </div>

      <div class="weather-metrics">
        <div>
          <span>💧 Lluvia</span>
          <strong>{{ formatPercent(selectedWeather.rain) }}</strong>
        </div>

        <div>
          <span>🌬 Viento</span>
          <strong>{{ formatSpeed(selectedWeather.wind) }}</strong>
        </div>
      </div>
    </div>

    <div
      v-else
      class="empty-state"
    >
      No hay información meteorológica disponible para esta fecha.
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue"
import {
  dailyWeatherForDate,
  weatherCodeLabel
} from "../utils/weather"

const props = defineProps({
  focused:Boolean,
  active:Boolean,
  forecast:Object,
  selectedDate:{
    type:Object,
    required:true
  }
})

const selectedWeather = computed(() =>
  dailyWeatherForDate(
    props.forecast,
    props.selectedDate
  )
)

const dateLabel = computed(() =>
  props.selectedDate.toLocaleDateString("es-MX", {
    weekday:"short",
    day:"numeric",
    month:"short"
  })
)

const isToday = computed(() =>
  props.selectedDate.toDateString() === new Date().toDateString()
)

const currentTemperature = computed(() => {

  const current =
    props.forecast?.current?.temperature_2m

  return Number.isFinite(current)
    ? Math.round(current)
    : null

})

function formatPercent(value){

  return Number.isFinite(value)
    ? `${Math.round(value)}%`
    : "--"

}

function formatSpeed(value){

  return Number.isFinite(value)
    ? `${Math.round(value)} km/h`
    : "--"

}
</script>

<style scoped>
.weather{

  display:flex;
  flex-direction:column;
  min-height:0;

}

.panel-heading{

  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:16px;
  margin-bottom:18px;

}

.panel-heading h2{

  margin-bottom:0;

}

.panel-heading span{

  color:#aab8c5;
  font-weight:700;
  text-transform:capitalize;
  white-space:nowrap;

}

.weather-content{

  flex:1;
  min-height:0;
  display:flex;
  flex-direction:column;
  justify-content:space-between;

}

.weather-content h3{

  font-size:20px;

}

.weather-main{

  margin:18px 0;

}

.weather-range{

  display:flex;
  gap:22px;
  align-items:center;
  font-size:2.3rem;
  font-weight:800;

}

.weather-label{

  margin-top:8px;
  color:#b5c5d1;
  font-size:1.15rem;
  font-weight:700;

}

.current-weather{

  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  padding:12px 14px;
  border-radius:12px;
  background:#263544;

}

.current-weather span,
.weather-metrics span{

  color:#aab8c5;
  font-weight:700;

}

.current-weather strong{

  font-size:1.5rem;

}

.weather-metrics{

  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
  margin-top:14px;

}

.weather-metrics div{

  padding:12px 14px;
  border-radius:12px;
  background:#263544;

}

.weather-metrics strong{

  display:block;
  margin-top:6px;
  font-size:1.25rem;

}

.empty-state{

  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#aebac5;
  font-size:20px;
  line-height:1.35;
  text-align:center;

}

.focused{

  border:3px solid #58c472;
  box-shadow:0 0 20px rgba(88,196,114,.5);
  transform:scale(1.01);
  transition:.2s;

}

.active{

  box-shadow:
    0 0 0 2px rgba(255,255,255,.16),
    0 0 22px rgba(88,196,114,.55);

}
</style>
