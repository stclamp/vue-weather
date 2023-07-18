<script setup>
import { ref, reactive, watch } from 'vue'
import axios from 'axios'
import WeatherCard from './components/WeatherCard.vue'
// import Chart from 'chart.js'
</script>

<template>
  <h1>Приложение Погоды на Vue.js</h1>
  <WeatherCard />
  <!-- Weather Blocks -->
  <!-- <div v-for="(weatherBlock, index) in weatherBlocks" :key="index" class="weather-block">
    <h2>{{ weatherBlock.city }}</h2>
    <button @click="deleteWeatherBlock(index)">Удалить</button> -->
  <!-- Weather Card -->
  <!-- <div v-if="weatherBlock.weatherInfo" class="weather-card">
      <h3>Погода на текущий день</h3>
      <p>Температура: {{ weatherBlock.weatherInfo.temp }} °C</p>
      <p>Описание: {{ weatherBlock.weatherInfo.description }}</p>
      <p>Влажность: {{ weatherBlock.weatherInfo.humidity }}%</p>
      <p>Ветер: {{ weatherBlock.weatherInfo.wind }} м/с</p>
    </div> -->
  <!-- Weather Chart -->
  <!-- <div v-if="weatherBlock.weatherData" class="weather-chart">
      <h3>График температуры на текущий день</h3>
      <canvas :id="'chart-' + index"></canvas>
    </div>
  </div>
  <button @click="addWeatherBlock">+</button> -->
  <!-- Favorite Cities -->
  <!-- <div id="favoriteCities">
    <h2>Избранное</h2>
    <div id="favoriteWeatherBlocks">
      <div
        v-for="(favoriteBlock, index) in favoriteWeatherBlocks"
        :key="index"
        class="weather-block favorite"
      >
        <h2>{{ favoriteBlock.city }}</h2>
        <button @click="deleteFavoriteBlock(index)">Удалить</button>
        <div class="weather-card">
          <h3>Погода на текущий день</h3>
          <p>Температура: {{ favoriteBlock.weatherInfo.temp }} °C</p>
          <p>Описание: {{ favoriteBlock.weatherInfo.description }}</p>
          <p>Влажность: {{ favoriteBlock.weatherInfo.humidity }}%</p>
          <p>Ветер: {{ favoriteBlock.weatherInfo.wind }} м/с</p>
        </div>
        <div class="weather-chart">
          <h3>График температуры на текущий день</h3>
          <canvas :id="'chart-favorite-' + index"></canvas>
        </div>
      </div>
    </div>
  </div> -->
</template>

<style>
/* Global Styles */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* App Styles */
#app {
  background-color: #f5f5f5;
  padding: 20px;
}

h1 {
  text-align: center;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .container {
    max-width: 100%;
    padding: 10px;
  }
}

@media (max-width: 360px) {
  input {
    font-size: 14px;
  }
}
</style>
