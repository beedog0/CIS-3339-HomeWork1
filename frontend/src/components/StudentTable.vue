<script setup>
defineProps({
  students: { type: Array, required: true },
  showActions: { type: Boolean, default: true },
  deletingId: { type: String, default: '' },
  caption: { type: String, default: 'Students' }
})
defineEmits(['delete'])
</script>

<template>
  <div class="table-wrap">
    <table>
      <caption class="sr-only">
        {{ caption }}
      </caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">ID</th>
          <th scope="col">Phone</th>
          <th scope="col">ZIP</th>
          <th v-if="showActions" scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student._id">
          <td>{{ student.name }}</td>
          <td>{{ student.studentId }}</td>
          <td>{{ student.phone }}</td>
          <td>{{ student.zip }}</td>
          <td v-if="showActions">
            <button
              type="button"
              class="btn btn-danger btn-small"
              :disabled="deletingId === student._id"
              :aria-label="`Delete ${student.name}`"
              @click="$emit('delete', student)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
