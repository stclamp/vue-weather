<template>
  <div class="weather-card">
    <div class="weather-search-wrapper">
      <WeatherSearch @currentWeather="handleValueChange" :card="card" />
      <button class="add-to-favorite" @click="addToFavorite">
        <span class="button-text">{{ buttonText }}</span>
        <StarIcon :fill="starColor" :width="20" :height="20" />
      </button>
    </div>
    <WeatherInfo
      :currentWeather="currentWeather"
      :card="props.card"
      :deleteWeatherCard="deleteWeatherCard"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import WeatherSearch from '@/components/WeatherSearch.vue'
import WeatherInfo from '@/components/WeatherInfo.vue'
import StarIcon from '@/components/StarIcon.vue'
import { EButton, type CurrentWeather } from '@/types/index'

interface WeatherCardProps {
  card: number
  deleteWeatherCard: (index: number) => void
}

const props = defineProps<WeatherCardProps>()

const buttonText = ref<string>(EButton.ADD)

let starColor = EButton.TRANSPARENT

const currentWeather = ref<CurrentWeather | null>(null)

onMounted(() => {
  const localCityExist = localStorage.getItem(`weather_block_${props.card}`)

  if (localCityExist) {
    buttonText.value = EButton.REMOVE
    starColor = EButton.ORANGE
  } else {
    buttonText.value = EButton.ADD
    starColor = EButton.TRANSPARENT
  }
})

function handleValueChange(value: CurrentWeather) {
  currentWeather.value = value
}

function addToFavorite() {
  if (buttonText.value === EButton.ADD) {
    const currentCity =
      typeof currentWeather?.value?.name === 'string' ? currentWeather?.value?.name : ''
    localStorage.setItem(`weather_block_${props.card}`, currentCity)
    buttonText.value = EButton.REMOVE
    starColor = EButton.ORANGE
  } else {
    localStorage.removeItem(`weather_block_${props.card}`)
    buttonText.value = EButton.ADD
    starColor = EButton.TRANSPARENT
  }
}
</script>

<style lang="scss">
.weather-card {
  -webkit-box-shadow: 2px 2px 24px -1px rgba(0, 0, 0, 0.27);
  -moz-box-shadow: 2px 2px 24px -1px rgba(0, 0, 0, 0.27);
  box-shadow: 2px 2px 24px -1px rgba(0, 0, 0, 0.27);
  border-radius: 9px;
  padding: 25px;
  margin-top: 30px;
}

.weather-search-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.add-to-favorite {
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    background-color: #ccc;
  }
}

.button-text {
  margin-right: 15px;
}

.weather-icon {
  width: 50px;
  height: 50px;
}
</style>
