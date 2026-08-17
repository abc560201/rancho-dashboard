<template>
  <section
    class="card calendar"
    :class="{
      focused: props.focused,
      compact: props.compact
    }"
  >
    <div
      v-if="props.compact"
      class="compact-day"
    >
      <span class="compact-label">Día seleccionado</span>

      <div class="compact-number">
        {{ props.selectedDate.getDate() }}
      </div>

      <div class="compact-month">
        {{ monthLabel }}
      </div>

      <div class="compact-weekday">
        {{ weekdayLabel }}
      </div>

      <div class="compact-meta">
        {{ dayEvents.length }} evento{{ dayEvents.length === 1 ? "" : "s" }}
      </div>
    </div>

    <MonthCalendar
      v-else
      :events="props.events"
      :forecast="props.forecast"
      :selected-date="props.selectedDate"
      @update:selectedDate="$emit('update:selectedDate',$event)"
      @visible-range="$emit('visible-range',$event)"
    />
  </section>
</template>

<script setup>
import { computed } from "vue"
import MonthCalendar from "./MonthCalendar.vue"

const props = defineProps({
  focused:Boolean,
  compact:Boolean,

  events:{
    type:Array,
    default:()=>[]
  },

  forecast:{
    type:Object,
    default:null
  },

  selectedDate:{
    type:Object,
    required:true
  }
})

defineEmits([
  "update:selectedDate",
  "visible-range"
])

const dayEvents = computed(() => {

  const selectedKey =
    props.selectedDate.toLocaleDateString("sv-SE")

  return props.events.filter(
    event => eventMatchesDate(event, selectedKey)
  )

})

function eventMatchesDate(event, selectedKey){

  if(Array.isArray(event.dates))
    return event.dates.includes(selectedKey)

  return event.date === selectedKey

}

const monthLabel = computed(() =>
  props.selectedDate.toLocaleDateString("es-MX", {
    month:"long",
    year:"numeric"
  })
)

const weekdayLabel = computed(() =>
  props.selectedDate.toLocaleDateString("es-MX", {
    weekday:"long"
  })
)
</script>

<style scoped>
.calendar{

  transition:.25s ease;

}

.compact{

  display:flex;
  align-items:center;
  justify-content:center;

}

.compact-day{

  width:100%;
  text-align:center;

}

.compact-label{

  display:block;
  margin-bottom:20px;
  color:#92a4b5;
  font-size:16px;
  font-weight:700;
  text-transform:uppercase;

}

.compact-number{

  font-size:78px;
  line-height:.92;
  font-weight:800;

}

.compact-month,
.compact-weekday{

  margin-top:10px;
  font-size:22px;
  font-weight:700;
  text-transform:capitalize;

}

.compact-weekday{

  color:#b7c3cf;
  font-size:19px;

}

.compact-meta{

  margin-top:28px;
  padding:12px;
  border-radius:12px;
  background:#263544;
  color:#e6edf2;
  font-weight:700;

}

.focused{

  border:3px solid #58c472;
  box-shadow:0 0 20px rgba(88,196,114,.5);
  transform:scale(1.01);
  transition:.2s;

}
</style>
