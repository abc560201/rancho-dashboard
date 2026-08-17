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
        v-if="isToday && props.forecast?.current"
        class="current-weather"
      >
        <span>Ahora</span>
        <strong>{{ Math.round(props.forecast.current.temperature_2m) }} °C</strong>
      </div>

      <div class="weather-metrics">
        <div>
          <span>💧 Lluvia</span>
          <strong>{{ selectedWeather.rain ?? 0 }}%</strong>
        </div>

        <div>
          <span>🌬 Viento</span>
          <strong>{{ Math.round(selectedWeather.wind ?? 0) }} km/h</strong>
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

const props = defineProps({
  focused:Boolean,
  active:Boolean,
  forecast:Object,
  selectedDate:{
    type:Object,
    required:true
  }
})

const selectedWeather = computed(() => {

  if(!props.forecast?.daily)
    return null

  const selectedKey =
    props.selectedDate.toLocaleDateString("sv-SE")
  const index =
    props.forecast.daily.time.findIndex(
      day => day === selectedKey
    )

  if(index === -1)
    return null

  return {
    max:props.forecast.daily.temperature_2m_max[index],
    min:props.forecast.daily.temperature_2m_min[index],
    rain:props.forecast.daily.precipitation_probability_max[index],
    wind:props.forecast.daily.wind_speed_10m_max[index],
    code:props.forecast.daily.weather_code[index]
  }

})

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

function weatherCodeLabel(code){

  const labels = {
    0:"Despejado",
    1:"Mayormente despejado",
    2:"Parcialmente nublado",
    3:"Nublado",
    45:"Niebla",
    48:"Niebla con escarcha",
    51:"Llovizna ligera",
    53:"Llovizna",
    55:"Llovizna intensa",
    61:"Lluvia ligera",
    63:"Lluvia",
    65:"Lluvia intensa",
    80:"Chubascos ligeros",
    81:"Chubascos",
    82:"Chubascos fuertes",
    95:"Tormenta"
  }

  return labels[code] || "Pronóstico disponible"

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
