<template>
  <div class="weather-info-wrapper">
    <div class="buttons-wrapper">
      <div class="buttons-info">
        <ButtonPrimary
          v-for="button in buttons"
          class="weather-button"
          @click="toggleActiveButton(button.type)"
          :key="button.type"
          :text="button.label"
          :class="{ active: activeButton === button.type }"
        />
      </div>
      <div class="buttons-delete">
        <ButtonPrimary
          v-if="!props.favorites"
          class="weather-button button-delete"
          @click="handleOpenModal"
          :text="$t('removeButton')"
        />
      </div>
    </div>
    <SpinnerIcon v-if="props.loading" class="info-spinner" />
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
    @deleteConfirmed="handleDeleteWeather"
    @closeModal="handleCloseModal"
    :isShowModal="showModal"
  />
  <WarningModal
    v-if="isEmpty"
    @closeWarningModal="handleCloseModal"
    :text="$t('waringModalTextEmpty')"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import i18n from '@/i18n'
import WeatherChart from '@/components/WeatherChart.vue'
import WeatherInfoDay from '@/components/WeatherInfoDay.vue'
import WeatherInfoWeek from '@/components/WeatherInfoWeek.vue'
import AcceptModal from '@/components/AcceptModal.vue'
import SpinnerIcon from '@/components/SpinnerIcon.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import WarningModal from '@/components/WarningModal.vue'
import { groupForecastsByDate } from '@/helpers/groupForecasts'
import { getDailyFortecasts } from '@/helpers/getDailyForecasts'
import { EDayWeekButton, type CurrentWeather, type WeekWeather } from '@/types/index.ts'

interface InfoProps {
  currentWeather: CurrentWeather | null
  cardIndex: { id: number }
  deleteWeatherCard?: (index: number) => void
  favorites?: boolean
  favoritesWeather?: CurrentWeather
  loading: boolean
}

const props = defineProps<InfoProps>()

const apiKey = import.meta.env.VITE_OPEN_WEATHER_API

const activeButton = ref<EDayWeekButton>(EDayWeekButton.DAY_BUTTON_TYPE)
const showModal = ref<boolean>(false)
const isEmpty = ref<boolean>(false)
const day = ref<boolean>(true)
const week = ref<boolean>(false)
const weekWeather = ref<WeekWeather[] | null | undefined>(null)
const weekLoading = ref<boolean>(false)

const locale = computed(() => i18n.global.locale.value)

const buttons = computed(() => {
  return [
    { type: EDayWeekButton.DAY_BUTTON_TYPE, label: i18n.global.t('dayButton') },
    { type: EDayWeekButton.WEEK_BUTTON_TYPE, label: i18n.global.t('weekButton') }
  ]
})

onMounted(() => {
  showDayWeather()
})

watch(
  [() => props.currentWeather, () => props.favoritesWeather, () => i18n.global.locale.value],
  () => {
    if (activeButton.value === EDayWeekButton.DAY_BUTTON_TYPE) {
      showDayWeather()
    } else {
      if (props.favorites) {
        showWeekWeather(props.favoritesWeather?.name)
      } else {
        showWeekWeather(props.currentWeather?.name)
      }
    }
  }
)

function toggleActiveButton(buttonType: EDayWeekButton) {
  if (!props.currentWeather) {
    isEmpty.value = true

    return
  }
  activeButton.value = buttonType
  if (buttonType === EDayWeekButton.DAY_BUTTON_TYPE) {
    showDayWeather()
  } else {
    if (props.favorites) {
      showWeekWeather(props.favoritesWeather?.name)
    } else {
      showWeekWeather(props.currentWeather?.name)
    }
  }
}

function handleOpenModal() {
  showModal.value = true
}

function handleCloseModal() {
  showModal.value = false
  isEmpty.value = false
}

function handleDeleteWeather() {
  if (props.deleteWeatherCard) {
    props.deleteWeatherCard(props.cardIndex.id)
    showModal.value = false
  }
}

function showDayWeather() {
  week.value = false
  day.value = true
}

async function showWeekWeather(city: string | undefined) {
  if (city) {
    week.value = true
    day.value = false

    weekWeather.value = await getWeatherData(city)
  }
}

async function getWeatherData(city: string) {
  try {
    weekLoading.value = true

    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=${locale.value}&appid=${apiKey}&units=metric`
    )

    const groupedForecasts = groupForecastsByDate(data.list)

    const dailyForecasts = getDailyFortecasts(groupedForecasts, locale.value)

    weekLoading.value = false

    return dailyForecasts
  } catch (error) {
    console.error(error)
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_mixins.scss';
@import '@/assets/styles/_variables.scss';
.buttons-wrapper {
  @include between-block;
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

.weather-button {
  min-width: 96px;
}

.weather-name {
  font-size: 36px;
  margin-bottom: 20px;
  text-align: center;
}

.weather-info {
  @include center-block;
  flex-direction: column;
  margin-top: 20px;
  min-height: 232px;
}

.week-spinner {
  min-height: 232px;
}

.weather-week-wrapper {
  @include center-block;
  flex-direction: column;
}

.weather-week {
  @include between-block;
  flex-direction: row;
  min-height: 232px;
}

.weather-temp-wrapper {
  display: flex;
  align-items: end;
}

.weather-temp {
  font-size: $fs-32;
  font-weight: 700;
  margin-left: 10px;
}

.weather-small {
  margin-top: 20px;
  font-size: $fs-14;
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

.info-spinner {
  min-height: 500px;
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

.button-delete {
  min-width: 103px;
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
    width: 170px;
    display: inline-flex;
    border-radius: 5px;
    margin-right: 15px;
    height: auto;
    &:last-child {
      margin-right: 15px;
    }
  }
}
</style>
