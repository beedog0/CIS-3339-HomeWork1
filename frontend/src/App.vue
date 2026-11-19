<script setup>
import AppNav from './components/AppNav.vue'
import ToastMessage from './components/ToastMessage.vue'
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <AppNav />
  <main id="main" class="container">
    <RouterView />
  </main>
  <ToastMessage />
</template>
