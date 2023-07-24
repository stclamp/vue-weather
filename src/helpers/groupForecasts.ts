import type { ForecastData, GroupedForecast } from '@/types'

export function groupForecastsByDate(list: ForecastData[]): GroupedForecast {
  return list.reduce((acc: Record<string, ForecastData[]>, forecast) => {
    const dateWithoutTime = forecast.dt_txt.split(' ')[0]

    if (!acc[dateWithoutTime]) {
      acc[dateWithoutTime] = []
    }

    acc[dateWithoutTime].push(forecast)

    return acc
  }, {})
}
