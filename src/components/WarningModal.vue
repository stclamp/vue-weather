<template>
  <div class="modal" @click="closeModal">
    <div class="modal-wrapper" @click.stop>
      <h4 class="modal-title">{{ text }}</h4>
      <button class="modal-close" @click="closeModal">X</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface WarningModalProps {
  text: string
}

defineProps<WarningModalProps>()

const emit = defineEmits(['openWarningModal', 'closeWarningModal'])

function closeModal() {
  emit('closeWarningModal')
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
</script>

<style scoped lang="scss">
@import '@/assets/styles/_variables.scss';
.modal-close {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
  color: $color-text;
}

@media (min-width: 360px) and (max-width: 768px) {
  .modal-close {
    right: 5px;
    top: 5px;
  }
}
</style>
