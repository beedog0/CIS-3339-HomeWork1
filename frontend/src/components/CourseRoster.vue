<script setup>
import { ref, watch } from 'vue'
import StudentTable from './StudentTable.vue'
import StatusMessage from './StatusMessage.vue'

const props = defineProps({
  courses: { type: Array, required: true },
  selectedCourseId: { type: String, default: '' },
  roster: { type: Array, required: true },
  loaded: Boolean,
  loading: Boolean,
  error: { type: String, default: '' }
})
const emit = defineEmits(['list'])

const courseId = ref(props.selectedCourseId)

watch(
  () => props.selectedCourseId,
  (value) => {
    courseId.value = value
  }
)

function onSubmit() {
  emit('list', courseId.value)
}
</script>

<template>
  <form class="roster-form" @submit.prevent="onSubmit">
    <div class="field">
      <label for="rosterCourse">Select course</label>
      <select id="rosterCourse" v-model="courseId">
        <option value="">-- Select Course --</option>
        <option v-for="course in courses" :key="course._id" :value="course._id">
          {{ course.name }} ({{ course.courseId }})
        </option>
      </select>
    </div>
    <button type="submit" class="btn" :disabled="!courseId || loading">List Students</button>
  </form>

  <div class="roster-result">
    <StatusMessage v-if="loading" type="loading">Loading students...</StatusMessage>
    <StatusMessage v-else-if="error" type="error">{{ error }}</StatusMessage>
    <template v-else-if="loaded">
      <StatusMessage v-if="roster.length === 0" type="empty">
        No students are enrolled in this course yet.
      </StatusMessage>
      <template v-else>
        <p class="result-count">{{ roster.length }} student{{ roster.length === 1 ? '' : 's' }} enrolled</p>
        <StudentTable :students="roster" :show-actions="false" caption="Students enrolled in the selected course" />
      </template>
    </template>
    <StatusMessage v-else type="info">Select a course and click List Students.</StatusMessage>
  </div>
</template>

<style scoped>
.roster-form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
}

.roster-form .field {
  flex: 1 1 14rem;
  margin: 0;
}

.roster-result {
  margin-top: 1rem;
}
</style>
