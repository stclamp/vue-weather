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
@import '@/assets/styles/_mixins.scss';
@import '@/assets/styles/_variables.scss';
.button-primary {
  @include box-shadow;
  border-radius: 10px;
  background: $button-bg;
  padding: 10px 20px;
  color: $color-text;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background: $button-bg-active;
  }

  &.active {
    background: $button-bg-active;
  }
}

@media (min-width: 360px) and (max-width: 768px) {
  .button-primary {
    width: 100%;
    border-radius: 7px;

    &:hover {
      background: $button-bg;
    }

    &.active {
      background: $button-bg-active;
    }
  }
}
</style>
