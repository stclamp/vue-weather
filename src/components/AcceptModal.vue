<template>
  <div class="modal" @click="closeModal">
    <div class="modal-wrapper" @click.stop>
      <h4 class="modal-title">Вы уверены, что хотите удалить?</h4>
      <div class="modal-buttons">
        <button class="modal-yes modal-button" @click="confirmDelete">Да</button>
        <button class="modal-no modal-button" @click="closeModal">Нет</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['deleteConfirmed', 'closeModal'])

function confirmDelete() {
  emit('deleteConfirmed')
}

function closeModal() {
  emit('closeModal')
}
</script>

<style scoped lang="scss">
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
