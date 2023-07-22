<template>
  <div class="modal" @click="closeModal">
    <div class="modal-wrapper" @click.stop>
      <h4 class="modal-title">{{ text }}</h4>
      <button class="modal-close" @click="closeModal">X</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface WarningModalProps {
  text: string
}

defineProps<WarningModalProps>()

const emit = defineEmits(['openWarningModal', 'closeWarningModal'])

function closeModal() {
  emit('closeWarningModal')
}
</script>

<style scoped lang="scss">
.modal-close {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
