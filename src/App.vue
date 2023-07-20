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

<style>
h1 {
  text-align: center;
}

a {
  color: #42849e;
  text-decoration: none;
  margin-right: 10px;
  transition: 0.3s ease-in-out;

  &:hover {
    color: #114458;
  }
}

.router-link-active {
  color: #42849e;
  border-bottom: 1px solid #42849e;

  &:hover {
    border-bottom: 1px solid #114458;
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
