<template>
  <template v-for="cardIndex in cards" :key="cardIndex">
    <WeatherCard :cardIndex="cardIndex" :deleteWeatherCard="deleteWeatherCard" />
  </template>
  <ButtonPrimary :text="'+'" @click="addWeatherCard" class="add-block" />
  <WarningModal
    v-if="isWarning"
    :text="$t('warningModalTextBlock')"
    @closeWarningModal="closeWarningModal"
  />
</template>

<script setup lang="ts">
import WeatherCard from '@/components/WeatherCard.vue'
import WarningModal from '@/components/WarningModal.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import { ref } from 'vue'

const cards = ref<number[]>([0])
const isWarning = ref<boolean>(false)

function closeWarningModal() {
  isWarning.value = false
}

function addWeatherCard() {
  const newIndex = cards.value.length
  if (newIndex >= 5) {
    isWarning.value = true
    return
  }
  cards.value.push(newIndex)
}

function deleteWeatherCard(index: number) {
  cards.value.splice(index, 1)
}
</script>

<style scoped lang="scss">
.add-block {
  width: 30%;
  display: block;
  margin: 25px auto;

  font-size: 16px;
}

@media (min-width: 360px) and (max-width: 768px) {
  .add-block {
    width: 100%;
  }
}
</style>
