const BASE_URL = '/api'

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(BASE_URL + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    })
  } catch {
    throw new Error('Could not reach the server. Is the backend running?')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error(data?.error || `Request failed (${response.status})`)
    error.status = response.status
    throw error
  }
  return data
}

export default {
  getStudents(search = '') {
    const query = search ? `?search=${encodeURIComponent(search)}` : ''
    return request(`/students${query}`)
  },
  addStudent(student) {
    return request('/students', { method: 'POST', body: JSON.stringify(student) })
  },
  deleteStudent(id) {
    return request(`/students/${id}`, { method: 'DELETE' })
  },

  getCourses() {
    return request('/courses')
  },
  addCourse(course) {
    return request('/courses', { method: 'POST', body: JSON.stringify(course) })
  },
  deleteCourse(id) {
    return request(`/courses/${id}`, { method: 'DELETE' })
  },

  enroll(studentId, courseId) {
    return request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ studentId, courseId })
    })
  },
  getCourseStudents(courseId) {
    return request(`/courses/${courseId}/students`)
  }
}
