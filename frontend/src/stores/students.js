import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useStudentStore = defineStore('students', () => {
  // every student, used by the enrollment dropdown
  const students = ref([])
  // what the students page is showing (all students or a search result)
  const results = ref([])
  const searchTerm = ref('')
  const loading = ref(false)
  const error = ref('')

  const count = computed(() => students.value.length)

  async function fetchStudents() {
    loading.value = true
    error.value = ''
    try {
      students.value = await api.getStudents()
      if (!searchTerm.value) {
        results.value = students.value
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function search(term) {
    searchTerm.value = term.trim()
    loading.value = true
    error.value = ''
    try {
      results.value = await api.getStudents(searchTerm.value)
      if (!searchTerm.value) {
        students.value = results.value
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function addStudent(student) {
    const created = await api.addStudent(student)
    await fetchStudents()
    if (searchTerm.value) {
      await search(searchTerm.value)
    }
    return created
  }

  async function deleteStudent(id) {
    const result = await api.deleteStudent(id)
    students.value = students.value.filter((s) => s._id !== id)
    results.value = results.value.filter((s) => s._id !== id)
    return result
  }

  return { students, results, searchTerm, loading, error, count, fetchStudents, search, addStudent, deleteStudent }
})
