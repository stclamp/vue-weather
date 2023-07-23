<template>
  <div class="weather-info weather-week" v-if="!loading">
    <div class="weather-week-wrapper" v-for="(day, index) in weekWeather" :key="index">
      <p class="dayOfWeek">{{ day.dayOfWeek }}</p>
      <p class="dayOfWeek">{{ day.date }}</p>
      <div class="weather-temp-wrapper">
        <img
          class="weather-icon"
          :src="`http://openweathermap.org/img/w/${day.icon}.png`"
          :alt="currentWeather?.weather.description"
        />
        <p class="weather-temp">{{ day.averageTemperature }}°</p>
      </div>
      <p class="weather-small">
        {{ $t('wind') }}:<span>{{ day.averageWind }} м/с</span>
      </p>
      <p class="weather-small">
        {{ $t('humidity') }}:<span>{{ day.averageHumidity }}%</span>
      </p>
    </div>
  </div>
  <SpinnerIcon v-else class="week-spinner" />
</template>

<script setup lang="ts">
import SpinnerIcon from '@/components/SpinnerIcon.vue'
import type { CurrentWeather, WeekWeather } from '@/types'

interface WeatherInfoDayProps {
  currentWeather: CurrentWeather | null
  weekWeather: WeekWeather[] | null | undefined
  loading: boolean
}

defineProps<WeatherInfoDayProps>()
</script>
