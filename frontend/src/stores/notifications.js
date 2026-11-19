import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  const message = ref('')
  const type = ref('success')
  let timer = null

  function show(text, kind = 'success') {
    message.value = text
    type.value = kind
    clearTimeout(timer)
    timer = setTimeout(clear, 5000)
  }

  function success(text) {
    show(text, 'success')
  }

  function error(text) {
    show(text, 'error')
  }

  function clear() {
    message.value = ''
    clearTimeout(timer)
  }

  return { message, type, success, error, clear }
})
