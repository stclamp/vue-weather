<template>
  <button
    v-for="sLocale in supportedLocales"
    :key="`locale-${sLocale}`"
    :value="sLocale"
    @click="switchLanguage"
    :class="`language-button ${sLocale === locale ? 'active' : ''}`"
  >
    {{ sLocale }}
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Translation from '@/i18n/translation.ts'

const { locale } = useI18n()

const router = useRouter()

const supportedLocales = Translation.supportedLocales

async function switchLanguage(event: Event) {
  const newLocale = (event.target as HTMLSelectElement).value
  await Translation.switchLanguage(newLocale)

  try {
    await router.replace({ params: { locale: newLocale } })
  } catch (err) {
    console.error(err)
    router.push('/')
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_variables.scss';
.language-button {
  border: none;
  color: #fff;
  background: none;
  cursor: pointer;
  font-size: 16px;
  margin-right: 5px;
  transition: 0.3s ease-in-out;

  &.active {
    border-bottom: 1px solid #fff;
  }

  &:hover {
    color: $color-secondary;
  }

  &:last-child {
    margin-right: 0;
  }
}
</style>
