<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 84 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M42.2 2L54.6218 27.1652L82.4 31.2254L62.3 50.8028L67.0436 78.4604L42.2 65.3954L17.3564 78.4604L22.1 50.8028L2 31.2254L29.7782 27.1652L42.2 2Z"
      :fill="fill"
      stroke="#DE9426"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
interface StarIconProps {
  fill: string
  width: number
  height: number
}

defineProps<StarIconProps>()
</script>
