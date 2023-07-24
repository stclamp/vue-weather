<template>
  <template v-for="cardIndex in cards" :key="cardIndex">
    <WeatherCard :cardIndex="cardIndex" :deleteWeatherCard="deleteWeatherCard" v-cloak />
  </template>
  <ButtonPrimary v-if="cards.length < 5" :text="'+'" @click="addWeatherCard" class="add-block" />
</template>

<script setup lang="ts">
import WeatherCard from '@/components/WeatherCard.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import { ref } from 'vue'

const cards = ref<{ id: number }[]>([{ id: 0 }])

function addWeatherCard() {
  const newIndex = cards.value.length

  cards.value.push({ id: newIndex })
}

function deleteWeatherCard(index: number) {
  cards.value = cards.value.filter((card) => card.id !== index)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_variables.scss';
.add-block {
  width: 30%;
  display: block;
  margin: 25px auto;

  font-size: $fs-16;
}

@media (min-width: 360px) and (max-width: 768px) {
  .add-block {
    width: 100%;
  }
}
</style>
