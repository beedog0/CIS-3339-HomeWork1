<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useStudentStore } from '../stores/students'
import { useCourseStore } from '../stores/courses'
import { useEnrollmentStore } from '../stores/enrollments'
import { useNotificationStore } from '../stores/notifications'
import EnrollmentForm from '../components/EnrollmentForm.vue'
import CourseRoster from '../components/CourseRoster.vue'
import StatusMessage from '../components/StatusMessage.vue'

const studentStore = useStudentStore()
const courseStore = useCourseStore()
const enrollmentStore = useEnrollmentStore()
const notifications = useNotificationStore()

const { students } = storeToRefs(studentStore)
const { courses } = storeToRefs(courseStore)
const { selectedCourseId, roster, rosterLoaded, loading: rosterLoading, error: rosterError } =
  storeToRefs(enrollmentStore)

const formRef = ref(null)
const saving = ref(false)
const pageLoading = ref(true)

const loadError = computed(() => studentStore.error || courseStore.error)
const missingData = computed(() => students.value.length === 0 || courses.value.length === 0)

onMounted(async () => {
  await Promise.all([studentStore.fetchStudents(), courseStore.fetchCourses()])
  pageLoading.value = false

  // refresh the roster in case students or courses changed on another page
  const stillExists = courses.value.some((c) => c._id === selectedCourseId.value)
  if (selectedCourseId.value && stillExists) {
    enrollmentStore.fetchRoster(selectedCourseId.value)
  } else {
    enrollmentStore.reset()
  }
})

async function handleEnroll({ studentId, courseId }) {
  saving.value = true
  try {
    const enrollment = await enrollmentStore.enroll(studentId, courseId)
    notifications.success(`${enrollment.student.name} was enrolled in ${enrollment.course.courseId}.`)
    formRef.value.reset()
  } catch (err) {
    notifications.error(err.message)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <h1>Enrollments</h1>

  <StatusMessage v-if="pageLoading" type="loading">Loading students and courses...</StatusMessage>
  <StatusMessage v-else-if="loadError" type="error">{{ loadError }}</StatusMessage>

  <template v-else>
    <section class="card" aria-labelledby="enrollHeading">
      <h2 id="enrollHeading">Enroll Student in Course</h2>
      <StatusMessage v-if="missingData" type="empty">
        You need at least one student and one course before you can enroll anyone. Add them on the
        <RouterLink to="/students">Students</RouterLink> and <RouterLink to="/courses">Courses</RouterLink> pages.
      </StatusMessage>
      <EnrollmentForm
        v-else
        ref="formRef"
        :students="students"
        :courses="courses"
        :saving="saving"
        @submit="handleEnroll"
      />
    </section>

    <section class="card" aria-labelledby="rosterHeading">
      <h2 id="rosterHeading">Students in Course</h2>
      <StatusMessage v-if="courses.length === 0" type="empty">No courses yet.</StatusMessage>
      <CourseRoster
        v-else
        :courses="courses"
        :selected-course-id="selectedCourseId"
        :roster="roster"
        :loaded="rosterLoaded"
        :loading="rosterLoading"
        :error="rosterError"
        @list="enrollmentStore.fetchRoster"
      />
    </section>
  </template>
</template>
