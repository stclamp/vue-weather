<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

import type { CityInfo, CurrentWeather } from '@/types/index.ts'

const cityInput = ref('')
const apiKey = import.meta.env.VITE_OPEN_WEATHER_API
const showAutoComplete = ref(false)
const autoCompleteCities = ref<CityInfo[]>([])
const emit = defineEmits(['currentWeather'])
async function fetchAutoCompleteCities(query: string) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
    )
    console.log(response)
    autoCompleteCities.value = response.data.map((city: CityInfo) => ({
      name: city.name,
      country: city.country
    }))
    showAutoComplete.value = true
  } catch (error) {
    console.error(error)
  }
}

function onCityInputChange() {
  if (cityInput.value.length >= 1) {
    fetchAutoCompleteCities(cityInput.value)
  } else {
    showAutoComplete.value = false
  }
}

async function selectCity(city: CityInfo) {
  cityInput.value = city.name
  showAutoComplete.value = false
  const weatherInfo = await getWeatherData(city)
  emit('currentWeather', weatherInfo)
}

async function getWeatherData(city: CityInfo) {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}&units=metric`
    )
    const weatherInfo: CurrentWeather = {
      temp: data.main.temp.toFixed(0),
      feelsLike: data.main.feels_like.toFixed(0),
      humidity: data.main.humidity.toFixed(0),
      wind: data.wind.speed.toFixed(0),
      weather: data.weather[0],
      name: cityInput.value
    }
    console.log('🚀 ~ file: WeatherSearch.vue:54 ~ getWeatherData ~ weatherInfo:', weatherInfo)
    return weatherInfo
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="autocomplete-container">
    <input type="text" v-model="cityInput" @input="onCityInputChange" placeholder="Введите город" />
    <div v-if="showAutoComplete" class="autocomplete">
      <div
        v-for="(city, index) in autoCompleteCities"
        :key="index"
        @click="selectCity(city)"
        class="autocomplete_wrapper"
      >
        <p class="city">{{ city.name }}</p>
        <p class="county">{{ city.country }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.autocomplete-container {
  position: relative;
  width: 50%;
}
input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.autocomplete {
  position: absolute;
  top: 100%;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  z-index: 1;
  max-height: 400px;
  min-width: 400px;
  overflow-y: auto;
}

.autocomplete div {
  padding: 10px 25px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  transition: 0.3s ease-in-out;

  &:hover {
    background-color: #979595;
  }
}
</style>
