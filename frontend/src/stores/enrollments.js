import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useEnrollmentStore = defineStore('enrollments', () => {
  const selectedCourseId = ref('')
  const roster = ref([])
  const rosterLoaded = ref(false)
  const loading = ref(false)
  const error = ref('')

  async function fetchRoster(courseId) {
    selectedCourseId.value = courseId
    roster.value = []
    rosterLoaded.value = false
    error.value = ''
    if (!courseId) return

    loading.value = true
    try {
      const data = await api.getCourseStudents(courseId)
      roster.value = data.students
      rosterLoaded.value = true
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function enroll(studentId, courseId) {
    const enrollment = await api.enroll(studentId, courseId)
    // keep the roster up to date if that course is the one being shown
    if (courseId === selectedCourseId.value) {
      await fetchRoster(courseId)
    }
    return enrollment
  }

  function reset() {
    selectedCourseId.value = ''
    roster.value = []
    rosterLoaded.value = false
    error.value = ''
  }

  return { selectedCourseId, roster, rosterLoaded, loading, error, fetchRoster, enroll, reset }
})
