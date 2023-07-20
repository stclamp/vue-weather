<template>
  <div class="weather-chart" v-if="localCity">
    <canvas :id="`weatherChart-${props.card}`" style="width: 100%; height: 400px"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import moment from 'moment'
import axios from 'axios'
import Chart, { type TooltipItem, type TooltipModel } from 'chart.js/auto'
import 'chartjs-adapter-moment'
import { convertUnixToDateTime } from '@/helpers/convertUnixToTime.ts'
import { groupForecastsByDate } from '@/helpers/groupForecasts'
import { getDailyFortecasts } from '@/helpers/getDailyForecasts'
import type { ForecastData, WeekWeather } from '@/types'

interface WeatherChartProps {
  city: string | undefined
  card: number
  day: boolean
}

const props = defineProps<WeatherChartProps>()
const apiKey = import.meta.env.VITE_OPEN_WEATHER_API

const localCity = ref<string | null | undefined>(props.city || null)

let chartInstance: Chart<'line', (string | undefined)[], string> | null = null

onMounted(() => {
  const cityFromLS = localStorage.getItem(`weather_block_${props.card}`)

  if (cityFromLS) {
    localCity.value = cityFromLS
  }
})

watch([() => props.day, () => props.city], async (newValue) => {
  localCity.value = newValue[1]

  const weatherData = await getData()

  if (weatherData && chartInstance) {
    chartInstance.destroy()
  }

  if (weatherData) {
    const weatherChart = document.getElementById(
      `weatherChart-${props.card}`
    ) as HTMLCanvasElement | null

    if (weatherChart) {
      createChart(weatherData, weatherChart)
    }
  }
})

async function getData() {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${localCity.value}&appid=${apiKey}&units=metric`
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
  } catch (error) {
    console.error(error)
  }
}

function createChart(weatherData: WeekWeather[], weatherChart: HTMLCanvasElement) {
  const weatherDates = weatherData.map((dataPoint: WeekWeather) => dataPoint.date)
  const weatherTemps = weatherData.map((dataPoint: WeekWeather) => dataPoint.temp)

  const ctx = weatherChart.getContext('2d')

  if (ctx) {
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: weatherDates,
        datasets: [
          {
            data: weatherTemps,
            backgroundColor: 'rgb(147, 228, 251)',
            tension: 0.4
          }
        ]
      },
      options: {
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
            beginAtZero: true,
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

<style lang="scss">
.weather-chart {
  width: 100%;
  max-height: 400px;
  margin-top: 20px;
}
</style>
