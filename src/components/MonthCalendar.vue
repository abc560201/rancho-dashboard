<template>

  <div class="month-calendar">

    <div class="month-header">
      {{ monthName }} {{ year }}
    </div>

    <div class="weekdays">
      <div
        v-for="day in weekdays"
        :key="day"
      >
        {{ day }}
      </div>
    </div>

    <div class="days">

      <div
        v-for="date in calendarDays"
        :key="date.toISOString()"
        class="day"
        :class="{
          selected: date.toDateString() === props.selectedDate.toDateString(),
          today: isToday(date),
          'other-month': date.getMonth() !== props.selectedDate.getMonth()
        }"
        @click="emit('update:selectedDate', date)"
      >

        <div class="day-number">
          {{ date.getDate() }}
        </div>

        <div
          v-if="weatherForDay(date)"
          class="day-weather"
        >
          🌡️
          {{ Math.round(weatherForDay(date).min) }}°
          /
          {{ Math.round(weatherForDay(date).max) }}°
        </div>

        <div class="day-icons">

          <span
            v-for="event in eventsForDay(date)"
            :key="event.id"
          >
            {{ event.icon }}
          </span>

        </div>

      </div>

    </div>

  </div>

</template>

<script setup>

import {
  computed,
  ref,
  watch
} from "vue"

const props = defineProps({

  events:{
    type:Array,
    default:()=>[]
  },

  forecast:Object,

  selectedDate:Object

})

const emit = defineEmits([
  "update:selectedDate"
])

const monthName = computed(() =>
  props.selectedDate.toLocaleDateString("es-MX",{
    month:"long"
  })
)

const year = computed(() =>
  props.selectedDate.getFullYear()
)

const weekdays = [
  "Do","Lu","Ma","Mi","Ju","Vi","Sa"
]

const visibleStart = ref(
  startOfWeek(props.selectedDate)
)

const calendarDays = computed(()=>{

  const days=[]

  for(let i=0;i<35;i++){

    const d = addDays(
      visibleStart.value,
      i
    )

    days.push(d)

  }

  return days

})

watch(
  () => props.selectedDate,
  selectedDate => {
    keepSelectedDateVisible(selectedDate)
  },
  { immediate:true }
)

function keepSelectedDateVisible(date){

  const selected = startOfDay(date)
  const start = startOfDay(visibleStart.value)
  const end = addDays(start, 35)

  if(selected < start){
    visibleStart.value = startOfWeek(selected)
    return
  }

  if(selected >= end){
    visibleStart.value = addDays(
      startOfWeek(selected),
      -28
    )
  }

}

function startOfWeek(date){

  const start = startOfDay(date)
  const weekday =
    start.getDay()

  start.setDate(
    start.getDate()-weekday
  )

  return start

}

function startOfDay(date){

  const day = new Date(date)

  day.setHours(0,0,0,0)

  return day

}

function addDays(date, days){

  const next = new Date(date)

  next.setDate(
    next.getDate()+days
  )

  return next

}

function eventsForDay(date){

  const dateString =
    date.toLocaleDateString("sv-SE")

  return props.events.filter(
    event=>eventMatchesDate(event, dateString)
  )

}

function eventMatchesDate(event, selectedKey){

  if(Array.isArray(event.dates))
    return event.dates.includes(selectedKey)

  return event.date === selectedKey

}

function isToday(date){

  return date.toDateString() === new Date().toDateString()

}

function weatherForDay(date){

  if(!props.forecast?.daily)
    return null

  const dateString =
    date.toLocaleDateString("sv-SE")

  const index =
    props.forecast.daily.time.findIndex(
      d=>d===dateString
    )

  if(index===-1)
    return null

  return{

    max:props.forecast.daily.temperature_2m_max[index],

    min:props.forecast.daily.temperature_2m_min[index],

    rain:props.forecast.daily.precipitation_probability_max[index],

    wind:props.forecast.daily.wind_speed_10m_max[index],

    code:props.forecast.daily.weather_code[index]

  }

}

</script>

<style scoped>

.month-calendar{

  height:100%;
  display:flex;
  flex-direction:column;

}

.month-header{

  text-align:center;
  font-size:1.5rem;
  font-weight:bold;
  margin-bottom:18px;
  text-transform:capitalize;

}

.weekdays{

  display:grid;
  grid-template-columns:repeat(7,1fr);

  text-align:center;

  font-weight:bold;

  margin-bottom:10px;

}

.days{

  display:grid;

  grid-template-columns:repeat(7,1fr);

  gap:8px;

  flex:1;

}

.day{

  background:#2f3640;

  border-radius:12px;

  min-height:82px;

  padding:6px;

  display:flex;

  flex-direction:column;

  justify-content:space-between;

  cursor:pointer;

  transition:.20s;

}

.day:hover{

  background:#404b5a;

}

.today{

  background:#334251;
  box-shadow:inset 0 0 0 2px rgba(120,219,145,.45);

}

.selected{

  border:3px solid #4CAF50;

  box-shadow:0 0 12px rgba(76,175,80,.45);

  transform:scale(1.03);

}

.other-month{

  opacity:.65;

}

.day-number{

  font-weight:bold;

  font-size:1rem;

}

.day-weather{

  font-size:.72rem;

  opacity:.8;

}

.day-icons{

  display:flex;

  flex-wrap:wrap;

  gap:3px;

  font-size:1rem;

}

</style>
