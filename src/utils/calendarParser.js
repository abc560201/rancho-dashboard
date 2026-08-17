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

    return {

      id:event.id,

      icon,

      title:cleanTitle,

      date,

      raw:event

    }

  })

}