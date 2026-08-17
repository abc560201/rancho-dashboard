const LAT = 25.490813822292246
const LON = -100.21113994331594

export async function getForecast() {

const url =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${LAT}` +
  `&longitude=${LON}` +
  `&current=temperature_2m,relative_humidity_2m,wind_speed_10m` +
  `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
  `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m` +
  `&forecast_days=16` +
  `&timezone=America%2FMexico_City`
  
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("No fue posible obtener el pronóstico.")
  }

  return await response.json()
}