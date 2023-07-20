<template>
  <div class="weather-info-wrapper">
    <div class="buttons-wrapper">
      <div class="buttons-info">
        <button
          v-for="button in buttons"
          :key="button.type"
          class="weather-button"
          :class="{ active: activeButton === button.type }"
          @click="toggleActiveButton(button.type)"
        >
          {{ button.label }}
        </button>
      </div>
      <div class="buttons-delete">
        <button class="weather-button button-delete" @click="handleOpenModal">Удалить</button>
      </div>
    </div>
    <p class="weather-name">{{ props.currentWeather?.name }}</p>
    <WeatherInfoDay v-if="props.currentWeather && day" :currentWeather="props.currentWeather" />
    <WeatherInfoWeek
      v-if="props.currentWeather && week"
      :currentWeather="props.currentWeather"
      :weekWeather="weekWeather"
    />
    <WeatherChart :city="props.currentWeather?.name" :card="card" :day="day" />
  </div>
  <AcceptModal
    v-if="showModal"
    :isShowModal="showModal"
    @deleteConfirmed="deleteWeatherCard(card)"
    @closeModal="handleCloseModal"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { CurrentWeather, WeekWeather } from '@/types/index.ts'
import WeatherChart from './WeatherChart.vue'
import WeatherInfoDay from './WeatherInfoDay.vue'
import WeatherInfoWeek from './WeatherInfoWeek.vue'
import AcceptModal from '@/components/AcceptModal.vue'
import axios from 'axios'
import { groupForecastsByDate } from '@/helpers/groupForecasts'
import { getDailyFortecasts } from '@/helpers/getDailyForecasts'

interface InfoProps {
  currentWeather: CurrentWeather | null
  card: number
  deleteWeatherCard: (index: number) => void
}

const props = defineProps<InfoProps>()

const apiKey = import.meta.env.VITE_OPEN_WEATHER_API
const activeButton = ref<string>('day')
const showModal = ref<boolean>(false)
const day = ref<boolean>(true)
const week = ref<boolean>(false)
const weekWeather = ref<WeekWeather[] | null>(null)

const buttons = [
  { type: 'day', label: 'День' },
  { type: 'week', label: 'Неделя' }
]

onMounted(() => {
  showDayWeather()
})

watch(
  () => props.currentWeather,
  () => (activeButton.value === 'day' ? showDayWeather() : showWeekWeather())
)

function toggleActiveButton(buttonType: string) {
  activeButton.value = buttonType
  if (buttonType === 'day') {
    showDayWeather()
  } else {
    showWeekWeather()
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

async function showWeekWeather() {
  week.value = true
  day.value = false
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${props.currentWeather?.name}&appid=${apiKey}&units=metric`
    )

    const groupedForecasts = groupForecastsByDate(data.list)

    const dailyForecasts = getDailyFortecasts(groupedForecasts)

    weekWeather.value = dailyForecasts
    console.log('🚀 ~ file: WeatherInfo.vue:111 ~ showWeekWeather ~ weekWeather:', weekWeather)
  } catch (error) {
    console.error(error)
  }
}
</script>

<style lang="scss">
.buttons-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.weather-button {
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  margin-right: 20px;

  &.active {
    background-color: #ccc;
  }

  &:hover {
    background-color: #ccc;
  }

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
  color: #8f8d8d;

  span {
    color: #000;
    font-weight: 700;
    margin-left: 6px;
  }
}

.dayOfWeek {
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
}
</style>
