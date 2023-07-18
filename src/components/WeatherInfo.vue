<script setup lang="ts">
import { ref } from 'vue'
import type { CurrentWeather } from '@/types/index.ts'
import WeatherChart from './WeatherChart.vue'

interface InfoProps {
  currentWeather: CurrentWeather | null
}

defineProps<InfoProps>()

const activeButton = ref('day')

const buttons = [
  { type: 'day', label: 'День' },
  { type: 'week', label: 'Неделя' }
]

function toggleActiveButton(buttonType: string) {
  activeButton.value = buttonType
}
</script>

<template>
  <div class="weather-info-wrapper">
    <div class="buttons-wrapper">
      <button
        v-for="button in buttons"
        :key="button.type"
        class="weather-button"
        :class="{ active: activeButton === button.type }"
        @click="toggleActiveButton(button.type)"
      >
        {{ button.label }}
      </button>
    </div>
    <div class="weather-info" v-if="currentWeather">
      <p class="weather-name">{{ currentWeather.name }}</p>
      <div class="weather-temp-wrapper">
        <img
          class="weather-icon"
          :src="`http://openweathermap.org/img/w/${currentWeather?.weather.icon}.png`"
          :alt="currentWeather.weather.description"
        />
        <p class="weather-temp">{{ currentWeather.temp }}°</p>
      </div>
      <p class="weather-small">
        Ощущается как:<span>{{ currentWeather.feelsLike }}°</span>
      </p>
      <p class="weather-small">
        Ветер:<span>{{ currentWeather.wind }} м/с</span>
      </p>
      <p class="weather-small">
        Влажность:<span>{{ currentWeather.humidity }}%</span>
      </p>
    </div>
    <WeatherChart :city="currentWeather?.name" />
  </div>
</template>

<style lang="scss">
.buttons-wrapper {
  display: flex;
  margin-top: 15px;
}
.weather-button {
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  margin-right: 20px;

  &.active {
    background-color: #ccc;
  }

  &:hover {
    background-color: #ccc;
  }

  &:last-child {
    margin-right: 0;
  }
}

.weather-name {
  font-size: 36px;
  margin-bottom: 20px;
}

.weather-info {
  margin-top: 20px;
  margin: 20px auto 0 auto;
}

.weather-temp-wrapper {
  display: flex;
  align-items: end;
}

.weather-temp {
  font-size: 32px;
  font-weight: 700;
  margin-left: 10px;
}

.weather-small {
  margin-top: 20px;
  font-size: 14px;
  color: #8f8d8d;

  span {
    color: #000;
    font-weight: 700;
    margin-left: 6px;
  }
}
</style>
