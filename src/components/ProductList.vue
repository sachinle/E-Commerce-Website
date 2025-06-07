<template>
  <div>
    <NavBar />
    <div class="container my-5">
      <h2 class="text-center mb-4 premium-title">TOP SELLING PRODUCTS</h2>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div class="col" v-for="product in limitedProducts" :key="product.id">
          <div class="card h-100 premium-card">
            <img :src="product.image" class="card-img-top p-3 premium-img" :alt="product.title" style="height: 200px; object-fit: contain;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title premium-card-title">{{ product.title }}</h5>
              <p class="card-text premium-card-text">{{ product.description.substring(0, 60) }}...</p>
              
              <div class="d-flex align-items-center mb-2">
                <span class="badge bg-warning text-dark me-2">{{ product.rating.rate }} Rating</span>
                <span class="text-muted">({{ product.rating.count }} reviews)</span>
              </div>

              <div class="d-flex align-items-center mb-2">
                <span class="text-muted bought">({{ product.rating.bought }})</span>
              </div>

              <div class="mt-auto">
                <p class="fw-bold text-success premium-price">₹{{ product.price }}</p>
                <div class="d-flex justify-content-between">
                  <router-link :to="'/product/' + product.id" class="btn btn-outline-primary btn-sm premium-btn">View</router-link>

                 
                  <button @click="addToCart(product)" class="btn btn-primary btn-sm premium-btn">Add to Cart</button>
                </div>
              </div>
            </div>
            <div class="premium-badge" v-if="product.price > 1000">Premium</div>
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
      products
    }
  },
  computed: {
    limitedProducts() {
      return this.products.slice(0, 10)
    }
  },
  methods: {
    addToCart(product) {
      cart.addItem(product)
      eventBus.emit('cart-updated', cart.getCount()) 
    }
  }
}
</script>

<style scoped>
.premium-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7c3aed;
  margin-bottom: 20px;
  text-align: center;
  
}

.premium-card {
  border: 2px solid #e0c3fc;
  box-shadow: 0 4px 24px rgba(160, 120, 255, 0.12);
  border-radius: 18px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  background: linear-gradient(135deg, #f8fafc 80%, #e0c3fc 100%);
}
.premium-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 8px 32px rgba(160, 120, 255, 0.18);
}

.premium-img {
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e0c3fc;
}

.premium-card-title {

  font-size: 1.1rem;
  font-weight: bold;
  color: #7c3aed;
}

.premium-card-text {
  font-size: 0.95rem;
  color: #555;
  min-height: 48px;
}

.bought{
  font-size: 0.85rem;
  font-weight: bold;
  color: #000000;
  margin-left: 8px;
}

.premium-price {
  font-size: 1.1rem;
  color: #16a34a;
  letter-spacing: 1px;
}

.premium-btn {
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.08);
}

.premium-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(90deg, #fbbf24, #a78bfa);
  color: #fff;
  font-size: 0.85rem;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.18);
  letter-spacing: 1px;
}

.card-title {
  font-size: 1rem;
}
.card-text {
  font-size: 0.9rem;
  color: #555;
}
</style>
