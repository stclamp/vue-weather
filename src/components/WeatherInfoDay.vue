<template>
  <div class="weather-info weather-day">
    <div class="weather-temp-wrapper">
      <img
        class="weather-icon"
        :src="`http://openweathermap.org/img/w/${props.currentWeather?.weather.icon}.png`"
        :alt="props.currentWeather?.weather.description"
      />
      <p class="weather-temp">
        {{ currentFavorites ? currentFavoritesWeather?.temp : props.currentWeather?.temp }}°
      </p>
    </div>
    <p class="weather-small">
      Ощущается как:<span
        >{{
          currentFavorites ? currentFavoritesWeather?.feelsLike : props.currentWeather?.feelsLike
        }}°</span
      >
    </p>
    <p class="weather-small">
      Ветер:<span
        >{{
          currentFavorites ? currentFavoritesWeather?.wind : props.currentWeather?.wind
        }}
        м/с</span
      >
    </p>
    <p class="weather-small">
      Влажность:<span
        >{{
          currentFavorites ? currentFavoritesWeather?.humidity : props.currentWeather?.humidity
        }}%</span
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import type { CurrentWeather } from '@/types'
import { ref, watch } from 'vue'

interface WeatherInfoDayProps {
  cardIndex: number
  currentWeather: CurrentWeather | null
  favorites?: boolean
  favoritesWeather?: CurrentWeather
}

const props = defineProps<WeatherInfoDayProps>()
const currentFavorites = ref<boolean>(props.favorites)
const currentFavoritesWeather = ref<CurrentWeather | undefined>(props.favoritesWeather)

watch([() => props.favorites, () => props.favoritesWeather], (newValue) => {
  currentFavorites.value = newValue[0]
  currentFavoritesWeather.value = newValue[1]
})
</script>
