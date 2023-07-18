<script setup lang="ts">
import WeatherSearch from './WeatherSearch.vue'
import StarIcon from './StarIcon.vue'

const orange = '#DE9426'
const transparent = 'transparent'
</script>

<template>
  <div class="weather-card">
    <WeatherSearch />
    <button>Добавить в избранное <StarIcon :fill="transparent" /></button>
  </div>
</template>

<style></style>
