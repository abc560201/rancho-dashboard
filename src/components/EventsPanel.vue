<template>
  <section
    class="card events"
    :class="{
      focused: props.focused,
      active: props.active
    }"
    @click="emit('activate')"
  >
    <div class="panel-heading">
      <h2>📋 Próximos eventos</h2>
      <span>{{ dateLabel }}</span>
    </div>

    <div
      ref="listRef"
      class="events-list"
    >
      <div
        v-if="dayEvents.length === 0"
        class="empty-state"
      >
        Sin eventos para este día.
      </div>

      <template v-else>
        <div
          v-for="(event, index) in dayEvents"
          :key="event.id"
          class="event"
          :class="{
            selected: props.active && index === props.selectedIndex
          }"
          :data-index="index"
          role="button"
          :aria-selected="props.active && index === props.selectedIndex"
          @click.stop="emit('select', index)"
          @dblclick.stop="emit('open', index)"
        >
          <div class="event-title">
            {{ event.icon }} {{ event.title }}
          </div>

          <div class="event-date">
            {{ formatDate(event.raw.start.dateTime || event.raw.start.date) }}
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import {
  computed,
  nextTick,
  ref,
  watch
} from "vue"

const props = defineProps({
  focused:Boolean,
  active:Boolean,
  selectedDate:{
    type:Object,
    required:true
  },
  selectedIndex:{
    type:Number,
    default:0
  },
  events: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  "activate",
  "select",
  "open"
])

const listRef = ref(null)

const dayEvents = computed(() => {

  const selectedKey =
    props.selectedDate.toLocaleDateString("sv-SE")

  return props.events.filter(
    event => event.date === selectedKey
  )

})

const dateLabel = computed(() =>
  props.selectedDate.toLocaleDateString("es-MX", {
    weekday:"short",
    day:"numeric",
    month:"short"
  })
)

watch(
  () => [
    props.active,
    props.selectedIndex,
    dayEvents.value.length
  ],
  async () => {

    if(!props.active)
      return

    await nextTick()

    const selected =
      listRef.value?.querySelector(
        `[data-index="${props.selectedIndex}"]`
      )

    selected?.scrollIntoView({
      block:"nearest"
    })

  }
)

function formatDate(value) {

  const hasTime = value.includes("T")

  if (hasTime) {

    return new Date(value).toLocaleString("es-MX", {
      hour:"2-digit",
      minute:"2-digit",
      hour12:false
    }) + " hs"

  }

  return "Todo el día"

}
</script>

<style scoped>
.events{

  display:flex;
  flex-direction:column;
  min-height:0;
  cursor:pointer;

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

.events-list{

  flex:1;
  min-height:0;
  overflow-y:auto;
  padding-right:8px;

}

.event{

  border-radius:8px;
  padding:8px 10px;
  border:1px solid transparent;

}

.event + .event{

  margin-top:8px;

}

.event.selected{

  background:rgba(88,196,114,.14);
  border-color:rgba(88,196,114,.7);

}

.event-title{

  font-weight:600;

}

.event-date{

  margin-top:2px;
  opacity:.86;

}

.empty-state{

  height:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#aebac5;
  font-size:20px;
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
