<template>
  <div class="weather-info weather-day">
    <div class="weather-temp-wrapper">
      <img
        class="weather-icon"
        :src="`http://openweathermap.org/img/w/${currentWeather?.weather.icon}.png`"
        :alt="props.currentWeather?.weather.description"
      />
      <p class="weather-temp">
        {{ currentFavorites ? currentFavoritesWeather?.temp : currentWeather?.temp }}°
      </p>
    </div>
    <p class="weather-small">
      Ощущается как:<span
        >{{
          currentFavorites ? currentFavoritesWeather?.feelsLike : currentWeather?.feelsLike
        }}°</span
      >
    </p>
    <p class="weather-small">
      Ветер:<span
        >{{ currentFavorites ? currentFavoritesWeather?.wind : currentWeather?.wind }} м/с</span
      >
    </p>
    <p class="weather-small">
      Влажность:<span
        >{{
          currentFavorites ? currentFavoritesWeather?.humidity : currentWeather?.humidity
        }}%</span
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CurrentWeather } from '@/types'

interface WeatherInfoDayProps {
  currentWeather: CurrentWeather | null
  favorites?: boolean
  favoritesWeather?: CurrentWeather
  loading: boolean
}

const props = defineProps<WeatherInfoDayProps>()
const currentFavorites = ref<boolean>(props.favorites)
const currentFavoritesWeather = ref<CurrentWeather | undefined>(props.favoritesWeather)

watch([() => props.favorites, () => props.favoritesWeather], (newValue) => {
  currentFavorites.value = newValue[0]
  currentFavoritesWeather.value = newValue[1]
})
</script>
