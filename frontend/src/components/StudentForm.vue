<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['submit'])
defineProps({
  saving: Boolean
})

const form = reactive({ name: '', studentId: '', phone: '', zip: '' })
const errors = reactive({ name: '', studentId: '', phone: '', zip: '' })
const nameInput = ref(null)

function validate() {
  errors.name = form.name.trim() ? '' : 'Name is required.'

  const id = String(form.studentId).trim()
  if (!id) {
    errors.studentId = 'Student ID is required.'
  } else if (!/^\d+$/.test(id)) {
    errors.studentId = 'Student ID can only contain numbers.'
  } else {
    errors.studentId = ''
  }

  const phone = form.phone.trim()
  if (!phone) {
    errors.phone = 'Phone number is required.'
  } else if (!/^[0-9()+\-.\s]{7,20}$/.test(phone)) {
    errors.phone = 'Enter a valid phone number, like 555-1234.'
  } else {
    errors.phone = ''
  }

  const zip = form.zip.trim()
  if (!zip) {
    errors.zip = 'ZIP code is required.'
  } else if (!/^\d{5}(-\d{4})?$/.test(zip)) {
    errors.zip = 'ZIP code must be 5 digits.'
  } else {
    errors.zip = ''
  }

  return !errors.name && !errors.studentId && !errors.phone && !errors.zip
}

function onSubmit() {
  if (!validate()) return
  emit('submit', {
    name: form.name.trim(),
    studentId: String(form.studentId).trim(),
    phone: form.phone.trim(),
    zip: form.zip.trim()
  })
}

function reset() {
  form.name = ''
  form.studentId = ''
  form.phone = ''
  form.zip = ''
  nameInput.value?.focus()
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
        <label for="addName">Name</label>
        <input
          id="addName"
          ref="nameInput"
          v-model="form.name"
          type="text"
          autocomplete="off"
          :aria-invalid="!!errors.name"
          aria-describedby="addNameError"
        />
        <p v-if="errors.name" id="addNameError" class="field-error">{{ errors.name }}</p>
      </div>

      <div class="field">
        <label for="addId">Student ID</label>
        <input
          id="addId"
          v-model="form.studentId"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          :aria-invalid="!!errors.studentId"
          aria-describedby="addIdError"
        />
        <p v-if="errors.studentId" id="addIdError" class="field-error">{{ errors.studentId }}</p>
      </div>

      <div class="field">
        <label for="addPhone">Phone</label>
        <input
          id="addPhone"
          v-model="form.phone"
          type="tel"
          autocomplete="off"
          :aria-invalid="!!errors.phone"
          aria-describedby="addPhoneError"
        />
        <p v-if="errors.phone" id="addPhoneError" class="field-error">{{ errors.phone }}</p>
      </div>

      <div class="field">
        <label for="addZip">ZIP code</label>
        <input
          id="addZip"
          v-model="form.zip"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          :aria-invalid="!!errors.zip"
          aria-describedby="addZipError"
        />
        <p v-if="errors.zip" id="addZipError" class="field-error">{{ errors.zip }}</p>
      </div>
    </div>

    <button type="submit" class="btn" :disabled="saving">
      {{ saving ? 'Adding...' : 'Add Student' }}
    </button>
  </form>
</template>
