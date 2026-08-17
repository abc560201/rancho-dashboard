export function dailyWeatherForDate(forecast, date){

  if(!forecast?.daily)
    return null

  const dateString =
    date.toLocaleDateString("sv-SE")
  const index =
    forecast.daily.time.findIndex(
      day => day === dateString
    )

  if(index === -1)
    return null

  const max =
    forecast.daily.temperature_2m_max[index]
  const min =
    forecast.daily.temperature_2m_min[index]

  if(!hasValidTemperatureRange(min, max))
    return null

  return {
    max,
    min,
    rain:validNumberOrNull(
      forecast.daily.precipitation_probability_max[index]
    ),
    wind:validNumberOrNull(
      forecast.daily.wind_speed_10m_max[index]
    ),
    code:forecast.daily.weather_code[index]
  }

}

export function weatherIcon(code){

  if([0,1].includes(code))
    return "☀️"

  if(code === 2)
    return "🌤"

  if(code === 3)
    return "☁️"

  if([45,48].includes(code))
    return "🌫"

  if(code >= 51 && code <= 67)
    return "🌧"

  if(code >= 71 && code <= 77)
    return "❄️"

  if(code >= 80 && code <= 82)
    return "🌦"

  if(code >= 85 && code <= 86)
    return "🌨"

  if(code >= 95)
    return "⛈"

  return "🌤"

}

export function weatherCodeLabel(code){

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
    95:"Tormenta",
    96:"Tormenta con granizo",
    99:"Tormenta con granizo fuerte"
  }

  return labels[code] || "Pronóstico disponible"

}

function hasValidTemperatureRange(min, max){

  if(!Number.isFinite(min) || !Number.isFinite(max))
    return false

  if(min === 0 && max === 0)
    return false

  return max >= min

}

function validNumberOrNull(value){

  return Number.isFinite(value)
    ? value
    : null

}
