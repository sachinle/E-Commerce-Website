<template>
  <div class="premium-bg min-vh-100">
    <NavBar />
    <div class="container text-center my-5 premium-card shadow-lg">
      <h1 class="display-4 premium-title">Welcome to Leo's E-Shop!</h1>
      <p class="lead mt-3 premium-lead">Discover the best products curated just for you.</p>
      <router-link to="/product-list" class="btn btn-premium mt-4 px-4 py-2">
        Go to Products
      </router-link>
    </div>
  </div>
</template>

<script>
import NavBar from './NavBar.vue'

export default {
  components: {
    NavBar
  }
}
</script>

<style scoped>
.premium-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
  min-height: 100vh;
}

.premium-card {
  background: #fff;
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.premium-title {
  font-weight: bold;
  color: #4f46e5;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(79, 70, 229, 0.08);
}

.premium-lead {
  font-size: 1.25rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.btn-premium {
  background: linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 2rem;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15);
}

.btn-premium:hover {
  background: linear-gradient(90deg, #4f46e5 0%, #818cf8 100%);
  color: #fff;
}
</style>
