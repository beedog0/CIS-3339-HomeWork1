<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['submit'])
defineProps({
  saving: Boolean
})

const form = reactive({ courseId: '', name: '' })
const errors = reactive({ courseId: '', name: '' })
const idInput = ref(null)

function validate() {
  errors.courseId = form.courseId.trim() ? '' : 'Course ID is required.'
  errors.name = form.name.trim() ? '' : 'Course name is required.'
  return !errors.courseId && !errors.name
}

function onSubmit() {
  if (!validate()) return
  emit('submit', { courseId: form.courseId.trim(), name: form.name.trim() })
}

function reset() {
  form.courseId = ''
  form.name = ''
  idInput.value?.focus()
}

function setError(field, message) {
  errors[field] = message
}

defineExpose({ reset, setError })
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div class="form-grid">
      <div class="field">
        <label for="courseId">Course ID</label>
        <input
          id="courseId"
          ref="idInput"
          v-model="form.courseId"
          type="text"
          placeholder="e.g. CIS 3339"
          autocomplete="off"
          :aria-invalid="!!errors.courseId"
          aria-describedby="courseIdError"
        />
        <p v-if="errors.courseId" id="courseIdError" class="field-error">{{ errors.courseId }}</p>
      </div>

      <div class="field">
        <label for="courseName">Course name</label>
        <input
          id="courseName"
          v-model="form.name"
          type="text"
          autocomplete="off"
          :aria-invalid="!!errors.name"
          aria-describedby="courseNameError"
        />
        <p v-if="errors.name" id="courseNameError" class="field-error">{{ errors.name }}</p>
      </div>
    </div>

    <button type="submit" class="btn" :disabled="saving">
      {{ saving ? 'Adding...' : 'Add Course' }}
    </button>
  </form>
</template>
