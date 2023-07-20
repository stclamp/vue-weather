<template>
  <div class="confirm-modal">
    <div class="confirm-modal-wrapper">
      <h4 class="modal-title">Вы уверены, что хотите удалить?</h4>
      <div class="modal-buttons">
        <button class="modal-yes modal-button" @click="confirmDelete">Да</button>
        <button class="modal-no modal-button" @click="closeModal">Нет</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface ConfirmModalProps {
  isShowModal: boolean
}

const props = defineProps<ConfirmModalProps>()
const emit = defineEmits(['deleteConfirmed', 'closeModal'])

const showModal = ref<boolean>(props.isShowModal)

watch(
  () => props.isShowModal,
  (newValue) => {
    showModal.value = newValue
  }
)

function confirmDelete() {
  showModal.value = false
  emit('deleteConfirmed')
}

function closeModal() {
  showModal.value = false
  emit('closeModal')
}
</script>

<style lang="scss">
.confirm-modal {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.114);
  position: fixed;
  left: 0;
  top: 0;
}

.confirm-modal-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 80px;
  border-radius: 8px;
  background-color: #fff;
}

.modal-title {
  font-size: 26px;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  margin-top: 35px;
}

.modal-button {
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  margin-right: 20px;
  min-width: 100px;
  text-align: center;

  &:last-child {
    margin-right: 0;
  }
}

.modal-yes {
  background-color: #b4f39b;

  &:hover {
    background-color: #76b65d;
  }
}

.modal-no {
  background-color: #f8a693;

  &:hover {
    background-color: #d46b53;
  }
}
</style>
