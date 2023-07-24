<template>
  <div class="weather-card">
    <div class="weather-search-wrapper">
      <WeatherSearch
        @currentWeather="handleValueChange"
        @favoritesWeather="handleChangeFavorite"
        @startLoading="startLoading"
        @endLoading="endLoading"
        :favorites="favorites"
        :cardIndex="cardIndex"
        :currentUserCity="currentUserCity"
        :localCityName="localCityName"
      />
      <div v-if="favorites" class="favorites-count">
        {{ $t('favorites') }} #{{ cardIndex.id + 1 }}
      </div>
      <ButtonPrimary
        class="add-to-favorite"
        @click="addToFavorite"
        :text="buttonText.text"
        :starColor="starColor"
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
    @closeWarningModal="closeWarningModal"
    :text="$t('warningModalTextFavorites')"
  />
  <WarningModal
    v-if="isEmpty"
    @closeWarningModal="closeWarningModal"
    :text="$t('waringModalTextEmpty')"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, reactive } from 'vue'
import axios from 'axios'
import i18n from '@/i18n'
import WeatherSearch from '@/components/WeatherSearch.vue'
import WeatherInfo from '@/components/WeatherInfo.vue'
import WarningModal from '@/components/WarningModal.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import { type CurrentWeather } from '@/types/index'

const EButton = computed(() => {
  return {
    ADD: i18n.global.t('addToFavorite'),
    REMOVE: i18n.global.t('removeFromFavorite'),
    ORANGE: '#DE9426',
    TRANSPARENT: 'transparent'
  }
})

interface WeatherCardProps {
  cardIndex: { id: number }
  deleteWeatherCard?: (index: number) => void
  favorites?: boolean
  localCityName?: string
}

const props = defineProps<WeatherCardProps>()

const emit = defineEmits(['removeFromFavorites', 'favoritesWeather'])

let starColor = EButton.value.TRANSPARENT

const buttonText = reactive({
  text: EButton.value.ADD
})

const getIpToken = import.meta.env.VITE_GET_IP_TOKEN

const currentWeather = ref<CurrentWeather | null>(null)
const currentUserCity = ref<string>('')
const favoritesWeather = ref<CurrentWeather>()
const loading = ref<boolean>(false)
const isWarning = ref<boolean>(false)
const isEmpty = ref<boolean>(false)

onMounted(() => {
  watch(
    [
      () => currentWeather.value?.name,
      () => favoritesWeather.value?.name,
      () => props.localCityName,
      () => i18n.global.locale.value
    ],
    () => {
      const localCityExist = localStorage.getItem(`weather_block_${currentWeather.value?.name}`)

      if (localCityExist === currentWeather.value?.name || props.favorites) {
        buttonText.text = EButton.value.REMOVE
        starColor = EButton.value.ORANGE
      } else {
        buttonText.text = EButton.value.ADD
        starColor = EButton.value.TRANSPARENT
      }

      emit('favoritesWeather', favoritesWeather.value)
    }
  )
  if (props.cardIndex.id === 0) {
    getUserLocation()
  }

  if (props.favorites) {
    getUserLocation()
  }
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
  isEmpty.value = false
}

function addToFavorite() {
  if (!currentWeather.value) {
    isEmpty.value = true

    return
  }

  if (buttonText.text === EButton.value.ADD) {
    if (localStorage.length >= 6) {
      isWarning.value = true

      return
    }

    currentWeather.value &&
      localStorage.setItem(
        `weather_block_${currentWeather.value?.name}`,
        currentWeather.value?.name
      )

    buttonText.text = EButton.value.REMOVE
    starColor = EButton.value.ORANGE
  } else {
    localStorage.removeItem(`weather_block_${currentWeather.value?.name}`)

    buttonText.text = EButton.value.ADD
    buttonText.text = EButton.value.ADD
    starColor = EButton.value.TRANSPARENT

    if (props.favorites) {
      localStorage.removeItem(`weather_block_${favoritesWeather.value?.name}`)
      emit('removeFromFavorites', props.localCityName)
    }
  }
}

async function getUserLocation() {
  try {
    const { data } = await axios.get(`https://ipinfo.io/json?token=${getIpToken}`)

    currentUserCity.value = data.city
  } catch (error) {
    console.error(error)
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_mixins.scss';
@import '@/assets/styles/_variables.scss';
.weather-card {
  @include box-shadow;
  padding: 25px;
  margin-top: 30px;
}

.weather-search-wrapper {
  @include between-block;
}

.add-to-favorite {
  @include between-block;
  font-size: $fs-16;
  min-width: 240px;
  span {
    margin-left: 10px;
  }
}

.favorites-count {
  font-size: $fs-20;
}

.button-text {
  margin-right: 15px;
}

.weather-icon {
  width: 50px;
  height: 50px;
}

@media (min-width: 360px) and (max-width: 768px) {
  .weather-card {
    border-radius: 15px;
  }
  .weather-search-wrapper {
    flex-direction: column;
  }

  .add-to-favorite {
    margin-top: 20px;
  }
}
</style>
