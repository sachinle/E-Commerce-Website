<template>
  <div>
    <NavBar />
    <div class="container my-5">
      <button @click="$router.go(-1)" class="btn btn-outline-secondary mb-4 premium-btn-back">
        <i class="fas fa-arrow-left me-2"></i> Back to Products
      </button>
      
      <div class="row g-4">
        <div class="col-md-6">
          <div class="premium-product-image-container">
            <img :src="product.image" class="img-fluid rounded premium-product-image" :alt="product.title">
            <div class="premium-image-badge" v-if="product.price > 1000">
              <span class="premium-badge">Premium</span>
              <span class="discount-badge">-10%</span>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="premium-product-info">
            <h1 class="premium-product-title">{{ product.title }}</h1>
            
            <div class="d-flex align-items-center mb-3">
              <div class="premium-rating-badge me-3">
                {{ product.rating.rate }} <i class="fas fa-star"></i>
              </div>
              <span class="text-muted premium-review-count">({{ product.rating.count }} reviews)</span>
              <span class="premium-bought-count ms-3">{{ product.rating.bought }} bought</span>
            </div>
            
            <div class="premium-price-container mb-4">
              <h2 class="premium-current-price">₹{{ product.price }}</h2>
              <div class="premium-original-price" v-if="product.price > 1000">
                <del>₹{{ Math.round(product.price * 1.1) }}</del>
                <span class="premium-discount">10% OFF</span>
              </div>
            </div>
            
            <div class="premium-product-description mb-4">
              <h4 class="premium-section-title">Description</h4>
              <p>{{ product.description }}</p>
            </div>
            
            <div class="premium-product-actions">
              <button @click="addToCart" class="btn btn-primary premium-add-to-cart">
                <i class="fas fa-cart-plus me-2"></i> Add to Cart
              </button>
              <router-link class="nav-link premium-link" to="/cart">
            <button class="btn btn-outline-primary premium-buy-now">
                <i class="fas fa-bolt me-2"></i> Buy Now
              </button>
          </router-link>
              
            </div>
            
            <div class="premium-product-meta mt-4">
              <div class="premium-meta-item">
                <i class="fas fa-shield-alt me-2"></i>
                <span>1 Year Warranty</span>
              </div>
              <div class="premium-meta-item">
                <i class="fas fa-truck me-2"></i>
                <span>Free Delivery</span>
              </div>
              <div class="premium-meta-item">
                <i class="fas fa-undo me-2"></i>
                <span>7-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12">
          <div class="premium-product-specs">
            <h4 class="premium-section-title mb-4">Specifications</h4>
            <div class="row">
              <div class="col-md-6" v-for="(spec, index) in specifications" :key="index">
                <div class="premium-spec-item">
                  <span class="premium-spec-name">{{ spec.name }}</span>
                  <span class="premium-spec-value">{{ spec.value }}</span>
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
import NavBar from './NavBar.vue'
import products from '@/assets/products.json'
import cart from '@/store/cart'
import eventBus from '@/eventBus'

export default {
  name: 'ProductDetail',
  components: { NavBar },
  props: ['id'],
  data() {
    return {
      product: {},
      specifications: [
        { name: 'Brand', value: 'Premium Brand' },
        { name: 'Model', value: '2023 Edition' },
        { name: 'Color', value: 'Classic Black' },
        { name: 'Material', value: 'High-grade Materials' },
        { name: 'Dimensions', value: '10 x 5 x 2 inches' },
        { name: 'Weight', value: '1.2 kg' },
        { name: 'Warranty', value: '1 Year Manufacturer' },
        { name: 'SKU', value: 'PRD' + this.id.toString().padStart(4, '0') }
      ]
    }
  },
  created() {
    this.product = products.find(p => p.id == this.id) || {}
    if (!this.product.rating.bought) {
      this.product.rating.bought = Math.floor(Math.random() * 500) + 50
    }
  },
  methods: {
    addToCart() {
      cart.addItem(this.product)
      eventBus.emit('cart-updated', cart.getCount())
    }
  }
}
</script>

<style scoped>
.premium-btn-back {
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.premium-btn-back:hover {
  background-color: #f3f4f6;
  transform: translateX(-4px);
}

.premium-product-image-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.12);
  background: white;
  padding: 20px;
  border: 1px solid #e9d5ff;
}

.premium-product-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  max-height: 500px;
}

.premium-image-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.premium-badge {
  background: linear-gradient(90deg, #fbbf24, #a78bfa);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
}

.discount-badge {
  background: linear-gradient(90deg, #ef4444, #f97316);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.premium-product-info {
  padding: 20px;
}

.premium-product-title {
  font-size: 2rem;
  font-weight: 700;
  color: #7c3aed;
  margin-bottom: 1rem;
}

.premium-rating-badge {
  background: #fbbf24;
  color: #78350f;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.premium-review-count {
  font-size: 0.9rem;
}

.premium-bought-count {
  font-size: 0.9rem;
  font-weight: 500;
  color: #16a34a;
}


.premium-price-container {
  padding: 16px 0;
  border-bottom: 1px solid #e9d5ff;
}

.premium-current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #16a34a;
  margin-bottom: 0.5rem;
}

.premium-original-price {
  font-size: 1.2rem;
  color: #6b7280;
}

.premium-discount {
  background: #fef2f2;
  color: #dc2626;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 8px;
}


.premium-product-description {
  padding: 16px 0;
  border-bottom: 1px solid #e9d5ff;
}

.premium-section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #7c3aed;
  margin-bottom: 1rem;
}


.premium-product-actions {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #e9d5ff;
}

.premium-add-to-cart {
  flex: 1;
  border-radius: 10px;
  padding: 12px;
  font-weight: 600;
  background: linear-gradient(90deg, #7c3aed, #a78bfa);
  border: none;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  transition: all 0.3s ease;
}

.premium-add-to-cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.3);
}

.premium-buy-now {
  flex: 1;
  border-radius: 10px;
  padding: 12px;
  font-weight: 600;
  border-color: #7c3aed;
  color: #7c3aed;
  transition: all 0.3s ease;
}

.premium-buy-now:hover {
  background: #7c3aed;
  color: white;
}


.premium-product-meta {
  display: flex;
  gap: 24px;
  padding: 16px 0;
}

.premium-meta-item {
  display: flex;
  align-items: center;
  color: #4b5563;
  font-size: 0.9rem;
}

.premium-meta-item i {
  color: #7c3aed;
}


.premium-product-specs {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(124, 58, 237, 0.08);
  border: 1px solid #e9d5ff;
}

.premium-spec-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.premium-spec-name {
  color: #6b7280;
  font-weight: 500;
}

.premium-spec-value {
  color: #111827;
  font-weight: 600;
}


@media (max-width: 768px) {
  .premium-product-title {
    font-size: 1.5rem;
  }
  
  .premium-product-actions {
    flex-direction: column;
  }
  
  .premium-product-meta {
    flex-direction: column;
    gap: 12px;
  }
}
</style>