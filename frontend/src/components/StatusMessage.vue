<script setup>
defineProps({
  type: {
    type: String,
    default: 'info' // info | error | loading | empty
  }
})
</script>

<template>
  <p class="status" :class="type" :role="type === 'error' ? 'alert' : 'status'">
    <span v-if="type === 'loading'" class="spinner" aria-hidden="true"></span>
    <slot />
  </p>
</template>

<style scoped>
.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.75rem 0.9rem;
  border-radius: 6px;
  background: #f1f3f6;
  color: var(--muted);
}

.status.error {
  background: #fdecea;
  color: var(--danger);
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #c5cbd6;
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
