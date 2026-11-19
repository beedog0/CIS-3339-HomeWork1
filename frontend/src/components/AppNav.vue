<script setup>
const links = [
  { to: '/students', label: 'Students' },
  { to: '/courses', label: 'Courses' },
  { to: '/enrollments', label: 'Enrollments' }
]
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <span class="brand">Student Management System</span>
      <nav aria-label="Main navigation">
        <ul class="nav-links">
          <li v-for="link in links" :key="link.to">
            <RouterLink :to="link.to">{{ link.label }}</RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background: var(--primary);
  color: #fff;
}

.header-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.brand {
  font-size: 1.15rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  display: block;
  padding: 0.45rem 0.8rem;
  border-radius: 6px;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.15);
}

.nav-links a.router-link-active {
  background: #fff;
  color: var(--primary);
}
</style>
