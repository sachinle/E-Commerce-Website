<template>
  <div>
    <NavBar />
    <div class="container my-5">
      <div class="row mb-4">
        <div class="col-md-8">
          <div class="search-box">
            <i class="fas fa-search search-icon"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search products..." 
              class="search-input"
              @input="filterProducts"
            >
          </div>
        </div>
        <div class="col-md-4">
          <div class="filter-dropdown">
            <select v-model="selectedCategory" @change="filterProducts" class="form-select">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <i class="fas fa-chevron-down dropdown-icon"></i>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title mb-0">Top Selling Products</h2>
        <div class="results-count">{{ filteredProducts.length }} products found</div>
      </div>

      <div v-if="filteredProducts.length === 0" class="no-results text-center py-5">
        <i class="fas fa-search fa-3x mb-3 text-muted"></i>
        <h4>No products found</h4>
        <p class="text-muted">Try adjusting your search or filter criteria</p>
        <button @click="resetFilters" class="btn btn-primary mt-3">
          Reset Filters
        </button>
      </div>

      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div class="col" v-for="product in filteredProducts" :key="product.id">
          <div class="card h-100 product-card">
            <div class="product-badge" v-if="product.price > 1000">Premium</div>
            <div class="wishlist-icon" @click="toggleWishlist(product)">
              <i :class="[isInWishlist(product) ? 'fas' : 'far', 'fa-heart']"></i>
            </div>
            <img :src="product.image" class="card-img-top p-3 product-img" :alt="product.title">
            <div class="card-body d-flex flex-column">
              <div class="product-category mb-1">{{ product.category }}</div>
              <h5 class="card-title product-title">{{ product.title }}</h5>
              <div class="rating-container mb-2">
                <div class="stars">
                  <i v-for="n in 5" :key="n" 
                    :class="['fas', n <= Math.round(product.rating.rate) ? 'fa-star' : 'fa-star-half-alt']"
                    :style="{ color: n <= Math.round(product.rating.rate) ? '#FFB800' : '#D1D5DB' }"></i>
                </div>
                <span class="rating-count">({{ product.rating.count }})</span>
              </div>
              
              <div class="sales-info mb-2">
                <i class="fas fa-shopping-bag me-1"></i>
                <span>{{ product.rating.bought }}</span>
              </div>

              <div class="mt-auto">
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <p class="product-price">₹{{ product.price.toFixed(2) }}</p>
                  <div class="stock-status">
                    <i class="fas fa-check-circle text-success me-1"></i>
                    <span>In Stock</span>
                  </div>
                </div>
                <div class="d-flex justify-content-between">
                  <router-link :to="'/product/' + product.id" class="btn btn-outline-primary btn-details">
                    <i class="far fa-eye me-1"></i> Details
                  </router-link>
                  <button @click="addToCart(product)" class="btn btn-primary btn-add-to-cart">
                    <i class="fas fa-shopping-cart me-1"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import products from '@/assets/products.json'
import NavBar from './NavBar.vue'
import cart from '@/store/cart'
import eventBus from '@/eventBus'

export default {
  components: { NavBar },
  data() {
    return {
      products,
      wishlist: [],
      searchQuery: '',
      selectedCategory: '',
      filteredProducts: [...products]
    }
  },
  computed: {
    categories() {
      const uniqueCategories = new Set()
      this.products.forEach(product => uniqueCategories.add(product.category))
      return Array.from(uniqueCategories)
    }
  },
  methods: {
    filterProducts() {
      this.filteredProducts = this.products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                             product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory
        return matchesSearch && matchesCategory
      })
    },
    resetFilters() {
      this.searchQuery = ''
      this.selectedCategory = ''
      this.filteredProducts = [...this.products]
    },
    addToCart(product) {
      cart.addItem(product)
      eventBus.emit('cart-updated', cart.getCount()) 
    },
    toggleWishlist(product) {
      const index = this.wishlist.findIndex(item => item.id === product.id)
      if (index === -1) {
        this.wishlist.push(product)
      } else {
        this.wishlist.splice(index, 1)
      }
    },
    isInWishlist(product) {
      return this.wishlist.some(item => item.id === product.id)
    }
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2D3748;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #4F46E5, #8B5CF6);
}

.search-box {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: #F9FAFB;
}

.search-input:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  background-color: white;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6B7280;
}

.filter-dropdown {
  position: relative;
  width: 100%;
}

.filter-dropdown select {
  appearance: none;
  padding: 10px 15px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.95rem;
  width: 100%;
  background-color: #F9FAFB;
  cursor: pointer;
}

.filter-dropdown select:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.dropdown-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6B7280;
  pointer-events: none;
}

.results-count {
  font-size: 0.9rem;
  color: #6B7280;
}

.no-results {
  background-color: #F9FAFB;
  border-radius: 12px;
  margin-top: 20px;
}

.no-results h4 {
  color: #2D3748;
  margin-bottom: 10px;
}

/* Existing product card styles remain the same */
.product-card {
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  overflow: hidden;
  background: white;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #D1D5DB;
}

.product-img {
  height: 220px;
  object-fit: contain;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img {
  transform: scale(1.03);
}

.product-category {
  font-size: 0.75rem;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.product-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 8px 0;
  line-height: 1.4;
  min-height: 45px;
}

.product-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #4F46E5;
  margin: 0;
}

.rating-container {
  display: flex;
  align-items: center;
}

.stars {
  margin-right: 6px;
}

.rating-count {
  font-size: 0.8rem;
  color: #6B7280;
}

.sales-info {
  font-size: 0.85rem;
  color: #6B7280;
  display: flex;
  align-items: center;
}

.sales-info i {
  color: #4F46E5;
  font-size: 0.75rem;
}

.stock-status {
  font-size: 0.8rem;
  color: #10B981;
  display: flex;
  align-items: center;
}

.btn-details {
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.85rem;
  border: 1px solid #E5E7EB;
  color: #374151;
  transition: all 0.2s;
  background: white;
}

.btn-details:hover {
  border-color: #D1D5DB;
  background: #F3F4F6;
  color: #111827;
}

.btn-add-to-cart {
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.85rem;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  border: none;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.btn-add-to-cart:hover {
  background: linear-gradient(135deg, #4338CA, #6D28D9);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
}

.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #F59E0B, #EF4444);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
}

.wishlist-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  color: #9CA3AF;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 2;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.8);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.wishlist-icon:hover {
  color: #EF4444;
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.9);
}

.wishlist-icon .fas {
  color: #EF4444;
}
</style>