<template>
  <div class="autocomplete-container" v-if="!favorites">
    <input
      type="text"
      v-model="cityInput"
      @input="onCityInputChange"
      :placeholder="$t('searchPlaceholder')"
    />
    <div v-if="showAutoComplete" class="autocomplete">
      <SpinnerIcon v-if="loading" />
      <div
        v-else
        v-for="(city, index) in autoCompleteCities"
        class="autocomplete_wrapper"
        @click="selectCity(city)"
        :key="index"
      >
        <p class="city">{{ city.name }}</p>
        <p class="county">{{ city.country }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import axios from 'axios'
import i18n from '@/i18n'
import SpinnerIcon from '@/components/SpinnerIcon.vue'
import type { CityInfo, CurrentWeather } from '@/types/index.ts'

interface SearchProps {
  card?: number
  currentUserCity: string
  favorites?: boolean
  localCityName?: string
}

const apiKey = import.meta.env.VITE_OPEN_WEATHER_API

const locale = computed(() => i18n.global.locale.value)

const props = defineProps<SearchProps>()
const emit = defineEmits(['currentWeather', 'favoritesWeather', 'startLoading', 'endLoading'])

const cityInput = ref<string>('')
const showAutoComplete = ref<boolean>(false)
const autoCompleteCities = ref<CityInfo[]>([])
const loading = ref<boolean>(false)

onMounted(async () => {
  watch([() => props.currentUserCity, () => props.localCityName], async () => {
    if (props.currentUserCity) {
      const weatherInfo = await getWeatherData(props.currentUserCity)
      emit('currentWeather', weatherInfo)
    }

    if (props.favorites) {
      const weatherInfo = await getWeatherData(props.localCityName)
      emit('favoritesWeather', weatherInfo)
    }
  })
})

async function onCityInputChange() {
  if (cityInput.value.length >= 1) {
    autoCompleteCities.value = await fetchAutoCompleteCities(cityInput.value)
  } else {
    showAutoComplete.value = false
  }
}

async function selectCity(city: CityInfo) {
  cityInput.value = city.name
  showAutoComplete.value = false

  const weatherInfo = await getWeatherData(city.name)

  emit('currentWeather', weatherInfo)
}

async function fetchAutoCompleteCities(query: string) {
  try {
    loading.value = true
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
    )

    const cities = response.data.map((city: CityInfo) => ({
      name: city.name,
      country: city.country,
      lon: city.lon,
      lat: city.lat
    }))

    showAutoComplete.value = true
    loading.value = false

    return cities
  } catch (error) {
    console.error(error)
  }
}

async function getWeatherData(city: string | undefined) {
  try {
    if (city) {
      emit('startLoading')

      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${locale.value}&appid=${apiKey}&units=metric`
      )

      const weatherInfo: CurrentWeather = {
        temp: data.main.temp.toFixed(0),
        feelsLike: data.main.feels_like.toFixed(0),
        humidity: data.main.humidity.toFixed(0),
        wind: data.wind.speed.toFixed(0),
        weather: data.weather[0],
        name: data.name
      }

      emit('endLoading')
      return weatherInfo
    }
  } catch (error) {
    loading.value = false
    console.error(error)
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_mixins.scss';
@import '@/assets/styles/_variables.scss';

.autocomplete-container {
  position: relative;
  width: 50%;
}
input {
  border-radius: 10px;
  background: $secondary-bg;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;
  padding: 10px;
  width: 100%;
  border: none;
  color: $color-secondary;
  font-size: $fs-18;
  font-style: normal;
  font-weight: 400;

  &::placeholder {
    color: $color-secondary;
  }
}

.autocomplete {
  position: absolute;
  top: 100%;
  border: 1px solid $color-dark-gray;
  background: $main-bg;
  z-index: 999;
  max-height: 400px;
  min-width: 400px;
  width: 100%;
  overflow-y: auto;
}

.autocomplete_wrapper {
  @include between-block;
  padding: 10px 25px;
  font-size: $fs-18;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    background: $secondary-bg;
  }
}

@media (min-width: 360px) and (max-width: 768px) {
  input {
    border-radius: 7px;
  }
  .autocomplete-container {
    width: 100%;
  }

  .autocomplete {
    min-width: 100%;
  }
}
</style>
