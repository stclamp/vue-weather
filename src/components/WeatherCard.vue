<template>
  <div class="weather-card">
    <div class="weather-search-wrapper">
      <WeatherSearch
        @currentWeather="handleValueChange"
        @favoritesWeather="handleChangeFavorite"
        @startLoading="startLoading"
        @endLoading="endLoading"
        :favorites="favorites"
        :cardIndex="props.cardIndex"
        :currentUserCity="currentUserCity"
        :localCityName="localCityName"
      />
      <ButtonPrimary
        class="add-to-favorite"
        :text="buttonText"
        :starColor="starColor"
        @click="addToFavorite"
        :hasIcon="true"
      />
    </div>
    <div>
      <WeatherInfo
        :currentWeather="currentWeather"
        :favorites="favorites"
        :cardIndex="cardIndex"
        :deleteWeatherCard="deleteWeatherCard"
        :favoritesWeather="favoritesWeather"
        :loading="loading"
      />
    </div>
  </div>
  <WarningModal
    v-if="isWarning"
    :text="'Максимум 5 блоков в избранном!'"
    @closeWarningModal="closeWarningModal"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import WeatherSearch from '@/components/WeatherSearch.vue'
import WeatherInfo from '@/components/WeatherInfo.vue'
import { EButton, type CurrentWeather } from '@/types/index'
import WarningModal from './WarningModal.vue'
import ButtonPrimary from './ButtonPrimary.vue'

interface WeatherCardProps {
  cardIndex: number
  deleteWeatherCard?: (index: number) => void
  favorites?: boolean
  localCityName?: string
}

const props = defineProps<WeatherCardProps>()

const emit = defineEmits(['removeFromFavorites', 'favoritesWeather'])

let starColor = EButton.TRANSPARENT

const buttonText = ref<string>(EButton.ADD)
const currentWeather = ref<CurrentWeather | null>(null)
const currentUserCity = ref<string>('')
const favoritesWeather = ref<CurrentWeather>()
const loading = ref<boolean>(false)
const isWarning = ref<boolean>(false)

onMounted(() => {
  watch(
    [
      () => currentWeather.value?.name,
      () => favoritesWeather.value?.name,
      () => props.localCityName
    ],
    () => {
      const localCityExist = localStorage.getItem(`weather_block_${currentWeather.value?.name}`)
      if (localCityExist === currentWeather.value?.name || props.favorites) {
        buttonText.value = EButton.REMOVE
        starColor = EButton.ORANGE
      } else {
        buttonText.value = EButton.ADD
        starColor = EButton.TRANSPARENT
      }
      emit('favoritesWeather', favoritesWeather.value)
    }
  )
  getUserLocation()
})

function handleValueChange(value: CurrentWeather) {
  currentWeather.value = value
}

function handleChangeFavorite(value: CurrentWeather) {
  favoritesWeather.value = value
}

function startLoading() {
  loading.value = true
}

function endLoading() {
  loading.value = false
}

function closeWarningModal() {
  isWarning.value = false
}

function addToFavorite() {
  if (buttonText.value === EButton.ADD) {
    if (localStorage.length >= 5) {
      isWarning.value = true
      return
    }
    localStorage.setItem(
      `weather_block_${currentWeather.value?.name}`,
      currentWeather.value?.name as string
    )
    buttonText.value = EButton.REMOVE
    starColor = EButton.ORANGE
  } else {
    if (props.favorites) {
      localStorage.removeItem(`weather_block_${favoritesWeather?.value?.name}`)
      buttonText.value = EButton.ADD
      starColor = EButton.TRANSPARENT

      emit('removeFromFavorites', props.localCityName)
    } else {
      localStorage.removeItem(`weather_block_${currentWeather.value?.name}`)
      buttonText.value = EButton.ADD
      starColor = EButton.TRANSPARENT
    }
  }
}

async function getUserLocation() {
  try {
    const { data } = await axios.get('https://ipinfo.io/json?token=530a90b96baf45')

    currentUserCity.value = data.city
  } catch (error) {
    console.error('Ошибка при получении местоположения:', error)
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_mixins.scss';
.weather-card {
  @include box-shadow;
  padding: 25px;
  margin-top: 30px;
}

.weather-search-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.add-to-favorite {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    margin-left: 10px;
  }
}

.button-text {
  margin-right: 15px;
}

.weather-icon {
  width: 50px;
  height: 50px;
}

@media (min-width: 360px) and (max-width: 768px) {
  .weather-search-wrapper {
    flex-direction: column;
  }
}
</style>
