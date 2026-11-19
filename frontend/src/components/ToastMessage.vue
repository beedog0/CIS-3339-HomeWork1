<script setup>
import { useNotificationStore } from '../stores/notifications'

const notifications = useNotificationStore()
</script>

<template>
  <div class="toast-area" aria-live="polite">
    <div v-if="notifications.message" class="toast" :class="notifications.type" role="status">
      <span>{{ notifications.message }}</span>
      <button type="button" class="toast-close" aria-label="Dismiss message" @click="notifications.clear()">
        &times;
      </button>
    </div>
  </div>
</template>

<style scoped>
.toast-area {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 1rem;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 32rem;
  padding: 0.7rem 0.9rem;
  border-radius: 8px;
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
}

.toast.success {
  background: var(--success);
}

.toast.error {
  background: var(--danger);
}

.toast-close {
  border: none;
  background: none;
  color: #fff;
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.25rem;
}
</style>
