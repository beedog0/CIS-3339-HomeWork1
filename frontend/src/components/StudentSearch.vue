<script setup>
import { ref } from 'vue'

defineProps({
  loading: Boolean,
  activeTerm: { type: String, default: '' }
})
const emit = defineEmits(['search', 'clear'])

const term = ref('')

function onSubmit() {
  emit('search', term.value)
}

function onClear() {
  term.value = ''
  emit('clear')
}
</script>

<template>
  <form class="search-form" role="search" @submit.prevent="onSubmit">
    <div class="field">
      <label for="studentSearch">Student name or ID</label>
      <input id="studentSearch" v-model="term" type="search" placeholder="e.g. John" autocomplete="off" />
    </div>
    <div class="actions">
      <button type="submit" class="btn" :disabled="loading">Search</button>
      <button v-if="activeTerm" type="button" class="btn btn-secondary" @click="onClear">Show all</button>
    </div>
  </form>
</template>

<style scoped>
.search-form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
}

.search-form .field {
  flex: 1 1 14rem;
  margin: 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
}
</style>
