const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const CALENDAR_ID = import.meta.env.VITE_CALENDAR_ID

export async function getCalendarEvents(startDate, endDate) {

  if (!API_KEY || !CALENDAR_ID) {
    throw new Error("Falta configurar Google Calendar.")
  }

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

  return data.items
}
