<script setup>
defineProps({
  courses: { type: Array, required: true },
  deletingId: { type: String, default: '' }
})
defineEmits(['delete'])
</script>

<template>
  <div class="table-wrap">
    <table>
      <caption class="sr-only">
        All courses
      </caption>
      <thead>
        <tr>
          <th scope="col">Course ID</th>
          <th scope="col">Course Name</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" :key="course._id">
          <td>{{ course.courseId }}</td>
          <td>{{ course.name }}</td>
          <td>
            <button
              type="button"
              class="btn btn-danger btn-small"
              :disabled="deletingId === course._id"
              :aria-label="`Delete ${course.courseId}`"
              @click="$emit('delete', course)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
