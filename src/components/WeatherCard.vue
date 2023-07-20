<template>
  <div class="weather-card">
    <div class="weather-search-wrapper">
      <WeatherSearch
        @currentWeather="handleValueChange"
        @favoritesWeather="handleChangeFavorite"
        :favorites="favorites"
        :cardIndex="props.cardIndex"
        :currentUserCity="currentUserCity"
        :localCityName="localCityName"
      />
      <button class="add-to-favorite" @click="addToFavorite">
        <span class="button-text">{{ buttonText }}</span>
        <StarIcon :fill="starColor" :width="20" :height="20" />
      </button>
    </div>
    <WeatherInfo
      :currentWeather="currentWeather"
      :favorites="favorites"
      :cardIndex="props.cardIndex"
      :deleteWeatherCard="deleteWeatherCard"
      :favoritesWeather="favoritesWeather"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeMount } from 'vue'
import axios from 'axios'
import WeatherSearch from '@/components/WeatherSearch.vue'
import WeatherInfo from '@/components/WeatherInfo.vue'
import StarIcon from '@/components/StarIcon.vue'
import { EButton, type CurrentWeather } from '@/types/index'

interface WeatherCardProps {
  cardIndex: number
  deleteWeatherCard?: (index: number) => void
  favorites?: boolean
  localCityName?: string
}

const props = defineProps<WeatherCardProps>()

const emit = defineEmits(['removeFromFavorites', 'favoritesWeather'])

const buttonText = ref<string>(EButton.ADD)

let starColor = EButton.TRANSPARENT

const currentWeather = ref<CurrentWeather | null>(null)
const currentUserCity = ref<string>('')
const favoritesWeather = ref<CurrentWeather>()

onMounted(() => {
  watch([() => currentWeather.value?.name, () => favoritesWeather.value?.name], () => {
    const localCityExist = localStorage.getItem(`weather_block_${currentWeather.value?.name}`)
    if (localCityExist === currentWeather.value?.name || props.favorites) {
      buttonText.value = EButton.REMOVE
      starColor = EButton.ORANGE
    } else {
      buttonText.value = EButton.ADD
      starColor = EButton.TRANSPARENT
    }
  })

  emit('favoritesWeather', favoritesWeather.value)
})

onBeforeMount(() => {
  getUserLocation()
})

function handleValueChange(value: CurrentWeather) {
  currentWeather.value = value
}

function handleChangeFavorite(value: CurrentWeather) {
  favoritesWeather.value = value
}

function addToFavorite() {
  if (buttonText.value === EButton.ADD) {
    if (localStorage.length >= 5) {
      alert('Максимум 5 блоков в избранном!') //replace to custom modal
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
    const { data } = await axios.get('http://ip-api.com/json')

    currentUserCity.value = data.city
  } catch (error) {
    console.error('Ошибка при получении местоположения:', error)
  }
}
</script>

<style lang="scss">
.weather-card {
  -webkit-box-shadow: 2px 2px 24px -1px rgba(0, 0, 0, 0.27);
  -moz-box-shadow: 2px 2px 24px -1px rgba(0, 0, 0, 0.27);
  box-shadow: 2px 2px 24px -1px rgba(0, 0, 0, 0.27);
  border-radius: 9px;
  padding: 25px;
  margin-top: 30px;
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
