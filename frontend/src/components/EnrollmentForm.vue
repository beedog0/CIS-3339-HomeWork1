<script setup>
import { ref } from 'vue'

defineProps({
  students: { type: Array, required: true },
  courses: { type: Array, required: true },
  saving: Boolean
})
const emit = defineEmits(['submit'])

const studentId = ref('')
const courseId = ref('')
const error = ref('')

function onSubmit() {
  if (!studentId.value || !courseId.value) {
    error.value = 'Please select both a student and a course.'
    return
  }
  error.value = ''
  emit('submit', { studentId: studentId.value, courseId: courseId.value })
}

function reset() {
  studentId.value = ''
}

defineExpose({ reset })
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div class="form-grid">
      <div class="field">
        <label for="enrollStudent">Select student</label>
        <select id="enrollStudent" v-model="studentId">
          <option value="">-- Select Student --</option>
          <option v-for="student in students" :key="student._id" :value="student._id">
            {{ student.name }} ({{ student.studentId }})
          </option>
        </select>
      </div>

      <div class="field">
        <label for="enrollCourse">Select course</label>
        <select id="enrollCourse" v-model="courseId">
          <option value="">-- Select Course --</option>
          <option v-for="course in courses" :key="course._id" :value="course._id">
            {{ course.name }} ({{ course.courseId }})
          </option>
        </select>
      </div>
    </div>

    <p v-if="error" class="field-error" role="alert">{{ error }}</p>

    <button type="submit" class="btn" :disabled="saving">
      {{ saving ? 'Enrolling...' : 'Enroll Student' }}
    </button>
  </form>
</template>
