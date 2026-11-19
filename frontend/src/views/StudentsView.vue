<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useStudentStore } from '../stores/students'
import { useNotificationStore } from '../stores/notifications'
import StudentSearch from '../components/StudentSearch.vue'
import StudentForm from '../components/StudentForm.vue'
import StudentTable from '../components/StudentTable.vue'
import StatusMessage from '../components/StatusMessage.vue'

const studentStore = useStudentStore()
const notifications = useNotificationStore()
const { results, searchTerm, loading, error } = storeToRefs(studentStore)

const formRef = ref(null)
const saving = ref(false)
const deletingId = ref('')

const resultHeading = computed(() =>
  searchTerm.value ? `Results for "${searchTerm.value}"` : 'All Students'
)

onMounted(() => {
  studentStore.search('')
})

async function handleAdd(student) {
  saving.value = true
  try {
    await studentStore.addStudent(student)
    notifications.success(`${student.name} was added.`)
    formRef.value.reset()
  } catch (err) {
    if (err.status === 409) {
      formRef.value.setError('studentId', err.message)
    }
    notifications.error(err.message)
  } finally {
    saving.value = false
  }
}

async function handleDelete(student) {
  if (!confirm(`Delete student ${student.name}? Their enrollments will be removed too.`)) {
    return
  }
  deletingId.value = student._id
  try {
    await studentStore.deleteStudent(student._id)
    notifications.success(`${student.name} was deleted.`)
  } catch (err) {
    notifications.error(err.message)
  } finally {
    deletingId.value = ''
  }
}
</script>

<template>
  <h1>Students</h1>

  <section class="card" aria-labelledby="searchHeading">
    <h2 id="searchHeading">Search for a Student</h2>
    <StudentSearch
      :loading="loading"
      :active-term="searchTerm"
      @search="studentStore.search"
      @clear="studentStore.search('')"
    />
  </section>

  <section class="card" aria-labelledby="addHeading">
    <h2 id="addHeading">Add a Student</h2>
    <StudentForm ref="formRef" :saving="saving" @submit="handleAdd" />
  </section>

  <section class="card" aria-labelledby="resultHeading">
    <h2 id="resultHeading">{{ resultHeading }}</h2>
    <StatusMessage v-if="loading" type="loading">Loading students...</StatusMessage>
    <StatusMessage v-else-if="error" type="error">{{ error }}</StatusMessage>
    <StatusMessage v-else-if="results.length === 0" type="empty">
      {{ searchTerm ? 'Cannot find a student matching that search.' : 'No students yet. Add one above.' }}
    </StatusMessage>
    <StudentTable
      v-else
      :students="results"
      :deleting-id="deletingId"
      :caption="resultHeading"
      @delete="handleDelete"
    />
  </section>
</template>
