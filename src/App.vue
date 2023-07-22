<script setup lang="ts">
// import Chart from 'chart.js'
</script>

<template>
  <div class="container">
    <h1>Приложение Погоды на Vue.js</h1>
    <RouterLink to="/">Главная</RouterLink>
    <RouterLink to="/favorites">Избранное</RouterLink>
    <RouterView></RouterView>
  </div>
</template>

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

.router-link-active {
  color: $color-text;
  border-bottom: 1px solid $color-text;

  &:hover {
    border-bottom: 1px solid $color-secondary;
  }
}

@media (max-width: 1200px) {
  .container {
    max-width: 100%;
    padding: 10px;
  }
}

@media (max-width: 360px) {
  input {
    font-size: 14px;
  }
}
</style>
