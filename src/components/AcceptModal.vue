<template>
  <div class="modal" @click="closeModal">
    <div class="modal-wrapper" @click.stop>
      <h4 class="modal-title">{{ $t('acceptModalText') }}</h4>
      <div class="modal-buttons">
        <button class="modal-yes modal-button" @click="confirmDelete">
          {{ $t('acceptModalYes') }}
        </button>
        <button class="modal-no modal-button" @click="closeModal">{{ $t('acceptModalNo') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['deleteConfirmed', 'closeModal'])

function confirmDelete() {
  emit('deleteConfirmed')
}

const overflow = document.body.style.overflow
let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px'

onMounted(() => {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = paddingOffset
})

onUnmounted(() => {
  document.body.style.overflow = overflow
  document.body.style.paddingRight = '0'
})

function closeModal() {
  emit('closeModal')
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_mixins.scss';
@import '@/assets/styles/_variables.scss';
.modal-buttons {
  @include center-block;
  margin-top: 35px;
}

.modal-button {
  @include center-block;
  padding: 10px;
  font-size: $fs-16;
  border-radius: 5px;
  border: 1px solid $color-light-gray;
  cursor: pointer;
  transition: $transition;
  margin-right: 20px;
  min-width: 100px;
  text-align: center;

  &:last-child {
    margin-right: 0;
  }
}

.modal-yes {
  background-color: $color-green;

  &:hover {
    background-color: $color-green-hover;
  }
}

.modal-no {
  background-color: $color-red;

  &:hover {
    background-color: $color-red-hover;
  }
}
</style>
