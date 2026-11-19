import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useCourseStore = defineStore('courses', () => {
  const courses = ref([])
  const loading = ref(false)
  const error = ref('')

  const count = computed(() => courses.value.length)

  async function fetchCourses() {
    loading.value = true
    error.value = ''
    try {
      courses.value = await api.getCourses()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function addCourse(course) {
    const created = await api.addCourse(course)
    await fetchCourses()
    return created
  }

  async function deleteCourse(id) {
    const result = await api.deleteCourse(id)
    courses.value = courses.value.filter((c) => c._id !== id)
    return result
  }

  return { courses, loading, error, count, fetchCourses, addCourse, deleteCourse }
})
