<template>
  <div class="container">
    <h1>{{ $t('weatherName') }}</h1>
    <div class="home-wrapper">
      <div class="links-wrapper">
        <RouterLink :to="Translation.i18nRoute({ name: 'home' })">{{ $t('home') }}</RouterLink>
        <RouterLink :to="Translation.i18nRoute({ name: 'favorites' })">{{
          $t('favorites')
        }}</RouterLink>
      </div>
      <div class="localization-wrapper">
        <LanguageSwitcher />
      </div>
    </div>
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import Translation from '@/i18n/translation.ts'
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';
h1 {
  text-align: center;
}

a {
  color: $color-text;
  text-decoration: none;
  margin-right: 10px;
  transition: 0.3s ease-in-out;

  &:hover {
    color: $color-secondary;
  }
}

.router-link-exact-active {
  color: $color-text;
  border-bottom: 1px solid $color-text;

  &:hover {
    border-bottom: 1px solid $color-secondary;
  }
}

.home-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.localization-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 1200px) {
  .container {
    max-width: 100%;
    padding: 10px;
  }
}

@media (min-width: 360px) and (max-width: 768px) {
  .home-wrapper {
    margin-top: 15px;
  }
  input {
    font-size: 14px;
  }
}
</style>
