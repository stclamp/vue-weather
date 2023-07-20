<template>
  <div class="weather-info weather-day">
    <div class="weather-temp-wrapper">
      <img
        class="weather-icon"
        :src="`http://openweathermap.org/img/w/${props.currentWeather?.weather.icon}.png`"
        :alt="props.currentWeather?.weather.description"
      />
      <p class="weather-temp">{{ props.currentWeather?.temp }}°</p>
    </div>
    <p class="weather-small">
      Ощущается как:<span>{{ props.currentWeather?.feelsLike }}°</span>
    </p>
    <p class="weather-small">
      Ветер:<span>{{ props.currentWeather?.wind }} м/с</span>
    </p>
    <p class="weather-small">
      Влажность:<span>{{ props.currentWeather?.humidity }}%</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { CurrentWeather } from '@/types'

interface WeatherInfoDayProps {
  currentWeather: CurrentWeather | null
}

const props = defineProps<WeatherInfoDayProps>()
</script>
