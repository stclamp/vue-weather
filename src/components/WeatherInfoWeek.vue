<template>
  <div class="weather-info weather-week">
    <div v-for="(day, index) in weekWeather" :key="index">
      <div class="weather-week-wrapper">
        <p class="dayOfWeek">{{ day.dayOfWeek }}</p>
        <p class="dayOfWeek">{{ day.date }}</p>
        <div class="weather-temp-wrapper">
          <img
            class="weather-icon"
            :src="`http://openweathermap.org/img/w/${day.icon}.png`"
            :alt="props.currentWeather?.weather.description"
          />
          <p class="weather-temp">{{ day.averageTemperature }}°</p>
        </div>
        <!-- <p class="weather-small">
          Ощущается как:<span>{{ props.currentWeather?.feelsLike }}°</span>
        </p> -->
        <p class="weather-small">
          Ветер:<span>{{ day.averageWind }} м/с</span>
        </p>
        <p class="weather-small">
          Влажность:<span>{{ day.averageHumidity }}%</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CurrentWeather, WeekWeather } from '@/types'

interface WeatherInfoDayProps {
  currentWeather: CurrentWeather | null
  weekWeather: WeekWeather[] | null
}

const props = defineProps<WeatherInfoDayProps>()
</script>
