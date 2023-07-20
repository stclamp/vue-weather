<template>
  <template v-for="cardIndex in cards" :key="cardIndex">
    <WeatherCard :card="cardIndex" :deleteWeatherCard="deleteWeatherCard" />
  </template>
  <button @click="addWeatherCard" class="add-block">+</button>
</template>

<script setup lang="ts">
import WeatherCard from '@/components/WeatherCard.vue'
import { ref } from 'vue'

const cards = ref<number[]>([0])

function addWeatherCard() {
  const newIndex = cards.value.length
  if (newIndex >= 5) {
    alert('Максимум 5 блоков. Удалите предыдущий, что бы добавить новый!') //replace to custom modal
    return
  }
  cards.value.push(newIndex)
}

function deleteWeatherCard(index: number) {
  cards.value.splice(index, 1)
}
</script>

<style lang="scss">
.add-block {
  width: 30%;
  display: block;
  margin: 25px auto;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    background-color: #ccc;
  }
}
</style>
