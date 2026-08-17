const ICONS = [
  "🌳",
  "💧",
  "🚜",
  "🍐",
  "🛠",
  "🛒",
  "🏡",
  "👨‍👩‍👧",
  "🎉",
  "🐝",
  "🐴",
  "⚡",
  "📦"
]

export function parseEvents(events) {

  return events.map(event => {

    const title = event.summary || ""

    const icon =
      ICONS.find(i => title.startsWith(i)) || "📅"

    const cleanTitle =
      title.replace(icon, "").trim()

    const date =
      event.start.dateTime
        ? event.start.dateTime.slice(0,10)
        : event.start.date

    const endDate =
      getVisibleEndDate(event)

    return {

      id:event.id,

      icon,

      title:cleanTitle,

      date,

      endDate,

      dates:buildEventDates(date, endDate),

      raw:event

    }

  })

}

function getVisibleEndDate(event){

  const startDate =
    event.start.dateTime
      ? event.start.dateTime.slice(0,10)
      : event.start.date

  const endValue =
    event.end?.dateTime ||
    event.end?.date ||
    startDate

  let endDate =
    endValue.includes("T")
      ? endValue.slice(0,10)
      : endValue

  const isAllDayEnd =
    Boolean(event.end?.date) &&
    !event.end?.dateTime

  const endsAtMidnight =
    event.end?.dateTime &&
    event.end.dateTime.slice(11,19) === "00:00:00" &&
    endDate !== startDate

  if(isAllDayEnd || endsAtMidnight)
    endDate = addDaysKey(endDate, -1)

  return endDate < startDate
    ? startDate
    : endDate

}

function buildEventDates(startDate, endDate){

  const dates = []
  let cursor = startDate
  let guard = 0

  while(cursor <= endDate && guard < 370){
    dates.push(cursor)
    cursor = addDaysKey(cursor, 1)
    guard++
  }

  return dates

}

function addDaysKey(dateKey, days){

  const date = new Date(`${dateKey}T00:00:00`)

  date.setDate(
    date.getDate() + days
  )

  return date.toLocaleDateString("sv-SE")

}
