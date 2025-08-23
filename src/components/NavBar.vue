<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <RouterLink to="/" class="nav-brand">Finance Calculator</RouterLink>
      <div class="nav-links">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/coast-fire" class="nav-link">Coast FIRE</RouterLink>
        <RouterLink to="/mortgage-payoff" class="nav-link">Mortgage Payoff</RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #2c3e50;
  padding: 1rem 0;
  margin-bottom: 2rem;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.nav-brand {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
  padding: 0.5rem;
}

.nav-link:hover {
  opacity: 0.8;
}

.nav-link.router-link-active {
  border-bottom: 2px solid white;
  padding-bottom: 2px;
}

@media (max-width: 480px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-brand {
    font-size: 1.25rem;
  }
  
  .nav-links {
    gap: 1rem;
    justify-content: center;
  }
  
  .nav-link {
    font-size: 0.9rem;
  }
}
</style>