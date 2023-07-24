<template>
  <button
    v-for="sLocale in supportedLocales"
    @click="switchLanguage"
    :key="`locale-${sLocale}`"
    :value="sLocale"
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
  const newLocale = (event.target as HTMLButtonElement).value
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
  color: $color-text;
  background: none;
  cursor: pointer;
  font-size: $fs-16;
  margin-right: 5px;
  transition: $transition;

  &.active {
    border-bottom: 1px solid $color-text;
  }

  &:hover {
    color: $color-secondary;
  }

  &:last-child {
    margin-right: 0;
  }
}

@media (min-width: 360px) and (max-width: 768px) {
  .language-button {
    &:hover {
      color: $color-text;
    }
  }
}
</style>
