<template>
  <div class="weather-info-wrapper">
    <div class="buttons-wrapper">
      <div class="buttons-info">
        <ButtonPrimary
          v-for="button in buttons"
          :key="button.type"
          :text="button.label"
          class="weather-button"
          :class="{ active: activeButton === button.type }"
          @click="toggleActiveButton(button.type)"
        />
      </div>
      <div class="buttons-delete">
        <ButtonPrimary
          :text="'Удалить'"
          class="weather-button button-delete"
          @click="handleOpenModal"
          v-if="!props.favorites"
        />
      </div>
    </div>
    <SpinnerIcon v-if="props.loading" />
    <p class="weather-name" v-if="!loading">
      {{ favorites ? favoritesWeather?.name : currentWeather?.name }}
    </p>
    <WeatherInfoDay
      v-if="props.currentWeather && day && !props.loading"
      :favoritesWeather="favoritesWeather"
      :currentWeather="currentWeather"
      :favorites="favorites"
      :loading="loading"
    />
    <WeatherInfoWeek
      v-if="currentWeather && week"
      :currentWeather="currentWeather"
      :favorites="favorites"
      :weekWeather="weekWeather"
      :favoritesWeather="favoritesWeather"
      :cardIndex="cardIndex"
      :loading="weekLoading"
    />
    <WeatherChart
      v-if="!loading"
      :city="currentWeather?.name"
      :cardIndex="cardIndex"
      :day="day"
      :favorites="favorites"
      :favoritesWeather="favoritesWeather"
      :loading="loading"
    />
  </div>
  <AcceptModal
    v-if="showModal"
    :isShowModal="showModal"
    @deleteConfirmed="deleteWeatherCard && deleteWeatherCard(cardIndex)"
    @closeModal="handleCloseModal"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import WeatherChart from '@/components/WeatherChart.vue'
import WeatherInfoDay from '@/components/WeatherInfoDay.vue'
import WeatherInfoWeek from '@/components/WeatherInfoWeek.vue'
import AcceptModal from '@/components/AcceptModal.vue'
import SpinnerIcon from '@/components/SpinnerIcon.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import { groupForecastsByDate } from '@/helpers/groupForecasts'
import { getDailyFortecasts } from '@/helpers/getDailyForecasts'
import type { CurrentWeather, WeekWeather } from '@/types/index.ts'

interface InfoProps {
  currentWeather: CurrentWeather | null
  cardIndex: number
  deleteWeatherCard?: (index: number) => void
  favorites?: boolean
  favoritesWeather?: CurrentWeather
  loading: boolean
}

const props = defineProps<InfoProps>()

const apiKey = import.meta.env.VITE_OPEN_WEATHER_API

const activeButton = ref<string>('day')
const showModal = ref<boolean>(false)
const day = ref<boolean>(true)
const week = ref<boolean>(false)
const weekWeather = ref<WeekWeather[] | null | undefined>(null)
const weekLoading = ref<boolean>(false)

const buttons = [
  { type: 'day', label: 'День' },
  { type: 'week', label: 'Неделя' }
]

onMounted(() => {
  showDayWeather()
})

watch([() => props.currentWeather, () => props.favoritesWeather], () => {
  if (activeButton.value === 'day') {
    showDayWeather()
  } else {
    if (props.favorites) {
      showWeekWeather(props.favoritesWeather?.name as string)
    } else {
      showWeekWeather(props.currentWeather?.name as string)
    }
  }
})

function toggleActiveButton(buttonType: string) {
  activeButton.value = buttonType
  if (buttonType === 'day') {
    showDayWeather()
  } else {
    if (props.favorites) {
      showWeekWeather(props.favoritesWeather?.name as string)
    } else {
      showWeekWeather(props.currentWeather?.name as string)
    }
  }
}

function handleOpenModal() {
  showModal.value = true
}

function handleCloseModal() {
  showModal.value = false
}

function showDayWeather() {
  week.value = false
  day.value = true
}

async function showWeekWeather(city: string) {
  week.value = true
  day.value = false
  weekWeather.value = await getWeatherData(city)
}

async function getWeatherData(city: string) {
  try {
    weekLoading.value = true
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    )

    const groupedForecasts = groupForecastsByDate(data.list)

    const dailyForecasts = getDailyFortecasts(groupedForecasts)

    weekLoading.value = false
    return dailyForecasts
  } catch (error) {
    console.error(error)
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_variables.scss';
.buttons-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.weather-button {
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }
}

.buttons-info {
  display: flex;
}

.weather-name {
  font-size: 36px;
  margin-bottom: 20px;
  text-align: center;
}

.weather-info {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.weather-week {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

.weather-temp-wrapper {
  display: flex;
  align-items: end;
}

.weather-temp {
  font-size: 32px;
  font-weight: 700;
  margin-left: 10px;
}

.weather-small {
  margin-top: 20px;
  font-size: 14px;
  color: $color-secondary;

  span {
    color: $color-text;
    font-weight: 700;
    margin-left: 6px;
  }
}

.dayOfWeek {
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
}

@media (min-width: 360px) and (max-width: 768px) {
  .weather-info-wrapper {
    overflow: hidden;
  }
  .buttons-wrapper {
    flex-direction: column;
    margin-bottom: 25px;
  }

  .buttons-info {
    order: 2;
    margin-top: 15px;
  }
}

@media (min-width: 360px) and (max-width: 992px) {
  .weather-week {
    display: block;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: -20px;
    padding-bottom: 30px;
    padding-left: 15px;
  }

  .weather-week-wrapper {
    justify-content: center;
    align-items: center;
    width: 170px;
    display: inline-flex;
    border-radius: 5px;
    margin-right: 15px;
    flex-direction: column;
    height: auto;
    &:last-child {
      margin-right: 15px;
    }
  }
}
</style>
