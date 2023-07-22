<template>
  <div v-if="cards.length > 0">
    <template v-for="(card, index) in cards" :key="index">
      <WeatherCard
        :cardIndex="index"
        :localCityName="card"
        :favorites="favorites"
        @removeFromFavorites="handleDelete"
      />
    </template>
  </div>
  <div class="empty-favorites weather-card" v-else>Пока еще ничего нет в избранном...</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import WeatherCard from '@/components/WeatherCard.vue'

const cards = ref<string[]>([])
const favorites = ref<boolean>(true)

onMounted(() => {
  for (let i = 0; i < localStorage.length; i++) {
    const card = localStorage.getItem(localStorage.key(i) as string)
    cards.value.push(card as string)
  }
})

function handleDelete(city: string) {
  cards.value = cards.value.filter((item) => item !== city)
}
</script>

<style lang="scss">
@import '@/assets/styles/_mixins.scss';
.empty-favorites {
  @include box-shadow;
  border-radius: 10px;
  padding: 25px;
  margin-top: 30px;
}
</style>
