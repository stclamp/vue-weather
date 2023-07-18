<template>
  <div style="width: 100%">
    <canvas ref="weatherChartRef" id="weatherChartRef" style="width: 100%; height: 400px"></canvas>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-moment'
import moment from 'moment'

interface ChartProps {
  city: string | undefined
}

const props = defineProps<ChartProps>()
const apiKey = import.meta.env.VITE_OPEN_WEATHER_API

function convertUnixToDateTime(unixDate: number) {
  const date = new Date(unixDate * 1000)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
}

async function getData() {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=Kyiv&appid=${apiKey}&units=metric`
    )
    const listOfDates = data.list
      .map((item: any, i: number) => {
        if (i > 14) return
        return { date: convertUnixToDateTime(item.dt), temp: +item.main.temp.toFixed(0) }
      })
      .filter(Boolean)
    console.log('listOfDates', listOfDates)
    return listOfDates
  } catch (error) {
    console.error(error)
  }
}

import { onMounted } from 'vue'

onMounted(async () => {
  const weatherData = await getData()
  if (weatherData) {
    const weatherChartRef = document.getElementById('weatherChartRef') as HTMLCanvasElement | null
    if (weatherChartRef) {
      createChart(weatherData, weatherChartRef)
    }
  }
})

function createChart(weatherData: any, weatherChartRef: any) {
  const weatherDates = weatherData.map((dataPoint: any) => dataPoint.date)
  const weatherTemps = weatherData.map((dataPoint: any) => dataPoint.temp)

  const ctx = weatherChartRef.getContext('2d')

  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: weatherDates,
        datasets: [
          {
            label: 'Температура',
            data: weatherTemps,
            backgroundColor: 'rgb(147, 228, 251)'
          }
        ]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              parser: (value: any) => moment(value, 'DD.MM.YYYY HH:mm').toDate() as any,
              unit: 'hour',
              displayFormats: {
                hour: 'DD.MM HH:mm'
              },
              tooltipFormat: 'll HH:mm'
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
              stepSize: 5,
              callback: function (value: any) {
                return value + '°'
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context: any) {
                let label = context.label || ''

                if (label) {
                  label += ': '
                }

                if (context.parsed.y !== null) {
                  label += context.parsed.y + '°'
                }

                return label
              }
            }
          }
        }
      }
    })
  }
}
</script>

<style lang="scss"></style>
