<template>
  <button class="button-primary">
    {{ text }}
    <span v-if="hasIcon"><StarIcon :fill="starColor || '#fff'" :width="20" :height="20" /></span>
  </button>
</template>

<script setup lang="ts">
import StarIcon from '@/components/StarIcon.vue'

interface ButtonProps {
  text: string
  hasIcon?: boolean
  starColor?: string
}

defineProps<ButtonProps>()
</script>

<style scoped lang="scss">
@import '@/assets/styles/_variables.scss';
.button-primary {
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(72, 49, 157, 0.2);
  box-shadow: 5px 4px 10px 0px rgba(0, 0, 0, 0.25), 1px 1px 0px 0px rgba(255, 255, 255, 0.25) inset;
  padding: 10px 20px;
  color: $color-text;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    background: rgba(42, 23, 110, 0.768);
  }

  &.active {
    background: rgba(42, 23, 110, 0.768);
  }
}

@media (min-width: 360px) and (max-width: 768px) {
  .button-primary {
    width: 100%;

    &:hover {
      background: rgba(72, 49, 157, 0.2);
    }

    &.active {
      background: rgba(42, 23, 110, 0.768);
    }
  }
}
</style>
