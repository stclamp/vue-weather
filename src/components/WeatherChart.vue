<template>
  <div class="weather-chart" v-if="localCity">
    <canvas
      :id="`weatherChart-${props.cardIndex}-${city}`"
      style="width: 100%; height: 400px"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import moment from 'moment'
import axios from 'axios'
import Chart, { type TooltipItem, type TooltipModel } from 'chart.js/auto'
import 'chartjs-adapter-moment'
import { convertUnixToDateTime } from '@/helpers/convertUnixToTime.ts'
import { groupForecastsByDate } from '@/helpers/groupForecasts'
import { getDailyFortecasts } from '@/helpers/getDailyForecasts'
import type { CurrentWeather, ForecastData, WeekWeather } from '@/types'

interface WeatherChartProps {
  city: string | undefined
  cardIndex: number
  day: boolean
  favorites?: boolean
  favoritesWeather?: CurrentWeather
}

const props = defineProps<WeatherChartProps>()
const apiKey = import.meta.env.VITE_OPEN_WEATHER_API

const localCity = ref<string | null | undefined>(props.city || null)
const weatherData = ref()

let chartInstance: Chart<'line', (string | undefined)[], string> | null = null

watch(
  [() => props.day, () => props.city, () => props.favorites, () => props.favoritesWeather],
  async (newValue) => {
    localCity.value = newValue[1]

    if (props.favorites) {
      weatherData.value = await getData(props.favoritesWeather?.name)
    } else {
      weatherData.value = await getData(localCity.value)
    }

    if (weatherData.value && chartInstance) {
      chartInstance.destroy()
    }

    if (weatherData.value) {
      const weatherChart = document.getElementById(
        `weatherChart-${props.cardIndex}-${props.city}`
      ) as HTMLCanvasElement

      if (weatherChart) {
        createChart(weatherData.value, weatherChart)
      }
    }
  }
)

async function getData(city: string | undefined) {
  try {
    if (city) {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      )
      const listOfDates = data.list
        .map((item: ForecastData, i: number) => {
          if (i > 14) return
          return { date: convertUnixToDateTime(item.dt), temp: +item.main.temp.toFixed(0) }
        })
        .filter(Boolean)

      const groupedForecasts = groupForecastsByDate(data.list)
      const listOfWeeDates = getDailyFortecasts(groupedForecasts).map((date) => ({
        date: date.date,
        temp: date.averageTemperature
      }))

      return props.day ? listOfDates : listOfWeeDates
    }
  } catch (error) {
    console.error(error)
  }
}

function createChart(weatherData: WeekWeather[], weatherChart: HTMLCanvasElement) {
  const weatherDates = weatherData.map((dataPoint: WeekWeather) => dataPoint.date)
  const weatherTemps = weatherData.map((dataPoint: WeekWeather) => dataPoint.temp)

  const ctx = weatherChart.getContext('2d')

  Chart.defaults.color = 'rgba(235, 235, 245, 0.6)'
  if (ctx) {
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: weatherDates,
        datasets: [
          {
            data: weatherTemps,
            backgroundColor: 'rgb(147, 228, 251)',
            borderColor: 'rgba(235, 235, 245, 0.6)',
            pointBackgroundColor: '#DE9426',
            tension: 0.4
          }
        ]
      },
      options: {
        onResize(chart, size) {
          if (size.width < 1000) {
            if (chart.options.scales && chart.options.scales.x) {
              chart.options.scales.x.display = false
            }
          } else {
            if (chart.options.scales && chart.options.scales.x) {
              chart.options.scales.x.display = true
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              parser: (value: unknown) =>
                moment(
                  value as Date,
                  props.day ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY'
                ).toDate() as any,
              unit: 'hour',
              displayFormats: {
                hour: props.day ? 'DD.MM HH:mm' : 'DD.MM'
              },
              tooltipFormat: props.day ? 'll HH:mm' : 'll'
            },
            ticks: {
              source: 'labels',
              autoSkip: false,
              maxTicksLimit: 5,
              stepSize: 5
            }
          },
          y: {
            beginAtZero: false,
            ticks: {
              maxTicksLimit: 5,
              stepSize: 5,
              callback: function (value: string | number) {
                return value + '°'
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (this: TooltipModel<'line'>, tooltipItem: TooltipItem<'line'>) {
                let label = tooltipItem.label || ''

                if (label) {
                  label += ': '
                }

                if (tooltipItem.parsed.y !== null) {
                  label += tooltipItem.parsed.y + '°'
                }

                return label
              }
            }
          },
          legend: {
            display: false
          }
        }
      }
    })
  }
}
</script>

<style scoped lang="scss">
.weather-chart {
  width: 100%;
  max-height: 400px;
  margin-top: 20px;
}
</style>
