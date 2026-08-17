const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const CALENDAR_ID = import.meta.env.VITE_CALENDAR_ID
console.log("API_KEY:", import.meta.env.VITE_GOOGLE_API_KEY)
console.log("CALENDAR_ID:", import.meta.env.VITE_CALENDAR_ID)
export async function getCalendarEvents(startDate, endDate) {


const url =
  `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events` +
  `?key=${API_KEY}` +
  `&singleEvents=true` +
  `&orderBy=startTime` +
  `&timeMin=${startDate.toISOString()}` +
  `&timeMax=${endDate.toISOString()}` +
  `&maxResults=100` +
  `&_=${Date.now()}`

  const response = await fetch(url, {
    cache: "no-store"
  })

  if (!response.ok) {
    throw new Error("No fue posible leer el calendario.")
  }

  const data = await response.json()
  console.log("Eventos recibidos:", data.items.length)

console.table(
  data.items.map(e => ({
    id: e.id,
    summary: e.summary,
    start: e.start.dateTime || e.start.date,
    calendar: e.organizer?.displayName,
    recurring: !!e.recurringEventId
  }))
)

  console.log(url)
  return data.items
}