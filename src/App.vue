<template>
  <div class="dashboard">
    <Header />

    <main
      class="layout"
      :class="{ 'panel-mode': activePanel }"
    >
      <section class="calendar-column">
        <CalendarPanel
          :focused="focusedPanel === 'calendar'"
          :compact="!!activePanel"
          :events="events"
          :forecast="forecast"
          :selected-date="selectedDate"
          @update:selectedDate="updateSelectedDate"
        />
      </section>

      <section
        class="right-column"
        :class="activePanel ? 'active-' + activePanel : ''"
      >
        <EventsPanel
          :focused="focusedPanel === 'events'"
          :active="activePanel === 'events'"
          :events="events"
          :selected-index="selectedEventIndex"
          :selected-date="selectedDate"
          @activate="activatePanel('events')"
          @select="selectEvent"
          @open="openEventDetailByIndex"
        />

        <WeatherPanel
          :focused="focusedPanel === 'weather'"
          :active="activePanel === 'weather'"
          :forecast="forecast"
          :selected-date="selectedDate"
        />

        <CameraPanel
          :focused="focusedPanel === 'camera'"
          :active="activePanel === 'camera'"
          :selected-date="selectedDate"
        />
      </section>
    </main>

    <div
      v-if="eventDetail"
      class="modal-backdrop"
      @click.self="closeEventDetail"
    >
      <article class="event-modal">
        <div class="modal-header">
          <div>
            <p class="modal-kicker">Evento del día</p>
            <h2>{{ eventDetail.icon }} {{ eventDetail.title }}</h2>
          </div>

          <button
            class="modal-close"
            type="button"
            aria-label="Cerrar detalle"
            @click="closeEventDetail"
          >
            ×
          </button>
        </div>

        <div class="modal-grid">
          <section class="modal-section">
            <span class="modal-label">Fecha y hora</span>
            <p>{{ formatEventRange(eventDetail) }}</p>
          </section>

          <section
            v-if="eventLocation(eventDetail)"
            class="modal-section"
          >
            <span class="modal-label">Lugar</span>
            <p>{{ eventLocation(eventDetail) }}</p>
          </section>

          <section
            v-if="eventCalendar(eventDetail)"
            class="modal-section"
          >
            <span class="modal-label">Calendario</span>
            <p>{{ eventCalendar(eventDetail) }}</p>
          </section>
        </div>

        <section class="modal-section modal-description">
          <span class="modal-label">Detalle</span>
          <p>{{ eventDescription(eventDetail) }}</p>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup>
import {
    computed,
    ref,
    onMounted,
    onUnmounted,
    watch
} from "vue"
import Header from "./components/Header.vue"
import CalendarPanel from "./components/CalendarPanel.vue"
import EventsPanel from "./components/EventsPanel.vue"
import WeatherPanel from "./components/WeatherPanel.vue"
import CameraPanel from "./components/CameraPanel.vue"
import { getCalendarEvents } from "./services/googleCalendar"
import { getForecast } from "./services/weatherService"
import { parseEvents } from "./utils/calendarParser"

const selectedDate = ref(new Date())
const focusedPanel = ref("calendar")
const activePanel = ref(null)
const selectedEventIndex = ref(0)
const eventDetail = ref(null)
const forecast = ref(null)
const events = ref([])
const panels = [
    "calendar",
    "events",
    "weather",
    "camera"
]

const selectedDateEvents = computed(() => {

    const selectedKey = dateKey(selectedDate.value)

    return events.value.filter(
        event => event.date === selectedKey
    )

})

function updateSelectedDate(date){

    selectedDate.value = date
    selectedEventIndex.value = 0

}

function moveFocus(direction){

    let index = panels.indexOf(focusedPanel.value)
    const offset = direction === "down" ? 1 : -1

    if(index === -1)
        index = 0

    focusedPanel.value =
        panels[
            (index + offset + panels.length) % panels.length
        ]
}

function focusPanel(panel){

    if(panels.includes(panel))
        focusedPanel.value = panel

}

function moveSelectedDate(days){

    const date = new Date(selectedDate.value)

    date.setDate(
        date.getDate() + days
    )

    updateSelectedDate(date)
}

function activateFocusedPanel(){

    if(focusedPanel.value === "calendar"){
        activatePanel("events")
        return
    }

    activatePanel(focusedPanel.value)

}

function activatePanel(panel){

    focusPanel(panel)
    activePanel.value = panel

    if(panel === "events"){
        selectedEventIndex.value = boundedEventIndex(
            selectedEventIndex.value
        )
    }

}

function closeActivePanel(){

    activePanel.value = null

}

function selectEvent(index){

    selectedEventIndex.value = boundedEventIndex(index)
    activatePanel("events")

}

function openEventDetailByIndex(index){

    selectedEventIndex.value = boundedEventIndex(index)
    openSelectedEventDetail()

}

function openSelectedEventDetail(){

    const selectedEvent =
        selectedDateEvents.value[selectedEventIndex.value]

    if(selectedEvent)
        eventDetail.value = selectedEvent

}

function closeEventDetail(){

    eventDetail.value = null

}

function boundedEventIndex(index){

    if(selectedDateEvents.value.length === 0)
        return 0

    return Math.min(
        Math.max(index, 0),
        selectedDateEvents.value.length - 1
    )

}

function moveEventSelection(offset){

    if(selectedDateEvents.value.length === 0)
        return

    selectedEventIndex.value =
        (
            selectedEventIndex.value +
            offset +
            selectedDateEvents.value.length
        ) % selectedDateEvents.value.length

}

function isBackKey(key){

    return [
        "Escape",
        "Backspace",
        "BrowserBack"
    ].includes(key)

}

function onKey(e){

    let handled = true

    if(eventDetail.value){

        if(isBackKey(e.key))
            closeEventDetail()
        else
            handled = false

        if(handled)
            e.preventDefault()

        return

    }

    if(isBackKey(e.key)){

        if(activePanel.value)
            closeActivePanel()
        else
            handled = false

        if(handled)
            e.preventDefault()

        return

    }

    if(activePanel.value === "events"){

        switch(e.key){

            case "ArrowDown":
                moveEventSelection(1)
                break

            case "ArrowUp":
                moveEventSelection(-1)
                break

            case "Enter":
            case "NumpadEnter":
                openSelectedEventDetail()
                break

            default:
                handled = false

        }

        if(handled)
            e.preventDefault()

        return

    }

    if(activePanel.value){

        if(e.key === "Enter" || e.key === "NumpadEnter")
            handled = true
        else
            handled = false

        if(handled)
            e.preventDefault()

        return

    }

    switch(e.key){

        case "ArrowDown":
            if(focusedPanel.value === "calendar")
                moveSelectedDate(7)
            else
                moveFocus("down")
            break

        case "ArrowUp":
            if(focusedPanel.value === "calendar")
                moveSelectedDate(-7)
            else
                moveFocus("up")
            break

        case "ArrowRight":
            if(focusedPanel.value === "calendar")
                moveSelectedDate(1)
            else
                handled = false
            break

        case "ArrowLeft":
            if(focusedPanel.value === "calendar")
                moveSelectedDate(-1)
            else
                focusPanel("calendar")
            break

        case "Enter":
        case "NumpadEnter":
            activateFocusedPanel()
            break

        default:
            handled = false

    }

    if(handled)
        e.preventDefault()

}

function dateKey(date){

    return date.toLocaleDateString("sv-SE")

}

function formatEventRange(event){

    const start =
        event.raw.start.dateTime ||
        event.raw.start.date
    const end =
        event.raw.end?.dateTime ||
        event.raw.end?.date

    if(!end)
        return formatEventDate(start)

    const allDayStart = !start.includes("T")
    const allDayEnd = !end.includes("T")

    if(allDayStart && allDayEnd){

        const startDate = new Date(`${start}T00:00:00`)
        const endDate = new Date(`${end}T00:00:00`)
        const days =
            Math.round(
                (endDate - startDate) / 86400000
            )

        if(days <= 1)
            return formatEventDate(start)

        endDate.setDate(
            endDate.getDate() - 1
        )

        return `${formatEventDate(start)} - ${formatEventDate(dateKey(endDate))}`

    }

    return `${formatEventDate(start)} - ${formatEventDate(end)}`

}

function formatEventDate(value){

    const hasTime = value.includes("T")

    if(hasTime){

        return new Date(value).toLocaleString("es-MX", {
            weekday:"long",
            day:"numeric",
            month:"long",
            hour:"2-digit",
            minute:"2-digit",
            hour12:false
        })

    }

    return new Date(value).toLocaleDateString("es-MX", {
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"
    })

}

function eventLocation(event){

    return event.raw.location || ""

}

function eventCalendar(event){

    return (
        event.raw.organizer?.displayName ||
        event.raw.creator?.displayName ||
        ""
    )

}

function eventDescription(event){

    const description =
        event.raw.description ||
        "Sin descripción adicional."

    return String(description)
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]*>/g, "")
        .trim()

}

async function loadDashboard(){

  try{

    const today = new Date()

    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )

    const end = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    )

    const rawEvents = await getCalendarEvents(start, end)
    events.value = parseEvents(rawEvents)

    forecast.value = await getForecast()

  }catch(err){

    console.error(err)

  }

}

watch(selectedDateEvents, () => {

    selectedEventIndex.value = boundedEventIndex(
        selectedEventIndex.value
    )

})

onMounted(() => {

    loadDashboard()

    window.addEventListener(
        "keydown",
        onKey
    )

})

onUnmounted(()=>{

    window.removeEventListener(
        "keydown",
        onKey
    )

})
</script>

<style scoped>
.layout{

    display:grid;
    grid-template-columns:minmax(0, 1.85fr) minmax(320px, 1fr);
    gap:20px;
    flex:1;
    min-height:0;
    transition:grid-template-columns .25s ease;

}

.layout.panel-mode{

    grid-template-columns:minmax(180px, .42fr) minmax(0, 2.4fr);

}

.calendar-column{

    min-height:0;
    min-width:0;

}

.right-column{

    display:grid;
    grid-template-rows:minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, .8fr);
    gap:20px;
    min-height:0;
    min-width:0;

}

.right-column.active-events,
.right-column.active-weather,
.right-column.active-camera{

    grid-template-rows:minmax(0, 1fr);

}

.right-column.active-events :deep(.weather),
.right-column.active-events :deep(.camera),
.right-column.active-weather :deep(.events),
.right-column.active-weather :deep(.camera),
.right-column.active-camera :deep(.events),
.right-column.active-camera :deep(.weather){

    display:none;

}

.modal-backdrop{

    position:fixed;
    inset:0;
    z-index:20;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:48px;
    background:rgba(4, 10, 16, .72);
    backdrop-filter:blur(6px);

}

.event-modal{

    width:min(980px, 100%);
    max-height:calc(100vh - 96px);
    overflow:auto;
    background:#162331;
    border:2px solid rgba(88,196,114,.65);
    border-radius:18px;
    padding:34px;
    box-shadow:0 24px 80px rgba(0,0,0,.55);

}

.modal-header{

    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:28px;
    margin-bottom:28px;

}

.modal-kicker{

    color:#78db91;
    font-size:18px;
    font-weight:700;
    margin-bottom:8px;

}

.modal-header h2{

    font-size:40px;
    line-height:1.08;

}

.modal-close{

    width:54px;
    height:54px;
    border:0;
    border-radius:50%;
    color:white;
    background:#253648;
    font-size:42px;
    line-height:1;
    cursor:pointer;

}

.modal-grid{

    display:grid;
    grid-template-columns:repeat(3, minmax(0, 1fr));
    gap:16px;
    margin-bottom:22px;

}

.modal-section{

    background:#1d2d3d;
    border:1px solid #314456;
    border-radius:12px;
    padding:18px;

}

.modal-label{

    display:block;
    margin-bottom:8px;
    color:#9db0c1;
    font-size:15px;
    font-weight:700;
    text-transform:uppercase;

}

.modal-section p{

    font-size:21px;
    line-height:1.35;

}

.modal-description p{

    white-space:pre-wrap;

}
</style>
