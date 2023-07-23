import type { GroupedForecast } from '@/types'

export function getDailyFortecasts(groupedForecasts: GroupedForecast, locale: string) {
  const dailyForecasts = Object.keys(groupedForecasts).map((date) => {
    const forecastsForDate = groupedForecasts[date]

    const averageTemperature =
      forecastsForDate.reduce((sum, forecast) => sum + forecast.main.temp, 0) /
      forecastsForDate.length
    const averageWind =
      forecastsForDate.reduce((sum, forecast) => sum + forecast.wind.speed, 0) /
      forecastsForDate.length
    const averageHumidity =
      forecastsForDate.reduce((sum, forecast) => sum + forecast.main.humidity, 0) /
      forecastsForDate.length

    const dayMonth = new Date(date).toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit'
    })

    const dayOfWeek = new Date(date).toLocaleDateString(locale, {
      weekday: 'short'
    })

    const icon = forecastsForDate[0].weather[0].icon

    return {
      date: dayMonth,
      dayOfWeek,
      averageTemperature: +averageTemperature.toFixed(0),
      averageWind: +averageWind.toFixed(0),
      averageHumidity: +averageHumidity.toFixed(0),
      icon
    }
  })

  return dailyForecasts
}
