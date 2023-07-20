<template>
  <div v-if="cards.length > 0">
    <template v-for="(card, index) in cards" :key="card">
      <WeatherCard
        :cardIndex="index"
        :localCityName="card"
        :favorites="favorites"
        @removeFromFavorites="handleDelete"
        @favoritesWeather="handleChangeFavoritesWeather"
      />
    </template>
  </div>
  <div class="empty-favorites weather-card" v-else>Пока еще ничего нет в избранном...</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import WeatherCard from '@/components/WeatherCard.vue'
import type { CurrentWeather } from '@/types'

const cards = ref<string[]>([])

onMounted(() => {
  for (let i = 0; i < localStorage.length; i++) {
    const card = localStorage.getItem(localStorage.key(i) as string)
    cards.value.push(card as string)
  }
})

const favorites = ref<boolean>(true)
const favoritesValue = ref<CurrentWeather[]>([])

function handleDelete(city: string) {
  cards.value = cards.value.filter((item) => item !== city)
}

function handleChangeFavoritesWeather(value: CurrentWeather[]) {
  favoritesValue.value = value
}
</script>

<style></style>
