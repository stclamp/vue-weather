<script setup lang="ts">
import { ref } from 'vue'
import WeatherSearch from './WeatherSearch.vue'
import WeatherInfo from './WeatherInfo.vue'
import StarIcon from './StarIcon.vue'
import { EButton, type CurrentWeather } from '@/types/index'

const buttonText = ref<string>(EButton.ADD)
let starColor = EButton.TRANSPARENT

const currentWeather = ref<CurrentWeather | null>(null)

function handleValueChange(value: any) {
  currentWeather.value = value
}

function addToFavorite() {
  if (buttonText.value === EButton.ADD) {
    buttonText.value = EButton.REMOVE
    starColor = EButton.ORANGE
  } else {
    buttonText.value = EButton.ADD
    starColor = EButton.TRANSPARENT
  }
}
</script>

<template>
  <div class="weather-card">
    <div class="weather-search-wrapper">
      <WeatherSearch @currentWeather="handleValueChange" />
      <button class="add-to-favorite" @click="addToFavorite">
        <span class="button-text">{{ buttonText }}</span>
        <StarIcon :fill="starColor" :width="20" :height="20" />
      </button>
    </div>
    <WeatherInfo :currentWeather="currentWeather" />
  </div>
</template>

<style lang="scss">
.weather-card {
  -webkit-box-shadow: 2px 2px 24px -1px rgba(0, 0, 0, 0.27);
  -moz-box-shadow: 2px 2px 24px -1px rgba(0, 0, 0, 0.27);
  box-shadow: 2px 2px 24px -1px rgba(0, 0, 0, 0.27);
  border-radius: 9px;
  padding: 25px;
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
