<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCourseStore } from '../stores/courses'
import { useEnrollmentStore } from '../stores/enrollments'
import { useNotificationStore } from '../stores/notifications'
import CourseForm from '../components/CourseForm.vue'
import CourseTable from '../components/CourseTable.vue'
import StatusMessage from '../components/StatusMessage.vue'

const courseStore = useCourseStore()
const enrollmentStore = useEnrollmentStore()
const notifications = useNotificationStore()
const { courses, loading, error } = storeToRefs(courseStore)

const formRef = ref(null)
const saving = ref(false)
const deletingId = ref('')

onMounted(() => {
  courseStore.fetchCourses()
})

async function handleAdd(course) {
  saving.value = true
  try {
    const created = await courseStore.addCourse(course)
    notifications.success(`${created.courseId} was added.`)
    formRef.value.reset()
  } catch (err) {
    if (err.status === 409) {
      formRef.value.setError('courseId', err.message)
    }
    notifications.error(err.message)
  } finally {
    saving.value = false
  }
}

async function handleDelete(course) {
  if (!confirm(`Delete course ${course.courseId}? Its enrollments will be removed too.`)) {
    return
  }
  deletingId.value = course._id
  try {
    await courseStore.deleteCourse(course._id)
    if (enrollmentStore.selectedCourseId === course._id) {
      enrollmentStore.reset()
    }
    notifications.success(`${course.courseId} was deleted.`)
  } catch (err) {
    notifications.error(err.message)
  } finally {
    deletingId.value = ''
  }
}
</script>

<template>
  <h1>Courses</h1>

  <section class="card" aria-labelledby="addCourseHeading">
    <h2 id="addCourseHeading">Add a Course</h2>
    <CourseForm ref="formRef" :saving="saving" @submit="handleAdd" />
  </section>

  <section class="card" aria-labelledby="courseListHeading">
    <h2 id="courseListHeading">All Courses</h2>
    <StatusMessage v-if="loading" type="loading">Loading courses...</StatusMessage>
    <StatusMessage v-else-if="error" type="error">{{ error }}</StatusMessage>
    <StatusMessage v-else-if="courses.length === 0" type="empty">No courses yet. Add one above.</StatusMessage>
    <CourseTable v-else :courses="courses" :deleting-id="deletingId" @delete="handleDelete" />
  </section>
</template>
