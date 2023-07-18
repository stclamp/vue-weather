<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

import type { CityInfo } from '@/types/index.ts'

const cityInput = ref('')
const apiKey = '8018fff17223e00281a031c452dcf184'
const showAutoComplete = ref(false)
const autoCompleteCities = ref<CityInfo[]>([])
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

function selectCity(city: CityInfo) {
  cityInput.value = city.name
  showAutoComplete.value = false
  getWeatherData(city)
}

async function getWeatherData(city: CityInfo) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}&units=metric`
    )
    const weatherInfo = {
      temp: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed
    }
    return weatherInfo
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
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
</template>

<style lang="scss">
input {
  width: 50%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.autocomplete {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  z-index: 1;
  max-height: 200px;
  overflow-y: auto;
  width: 51%;
}

.autocomplete div {
  padding: 0 25px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  transition: 0.3s ease-in-out;

  &:hover {
    background-color: #979595;
  }
}
</style>
