<template>
  <NavBar />
  <div class="container my-5 text-center">
    <div class="premium-confirmation-card">
      <div class="premium-confirmation-icon">
        <img src="https://cdn.dribbble.com/userupload/23589345/file/original-3facc6dbca53f39fa3175635da27a61a.gif" 
             alt="Success" 
             class="premium-success-gif">
      </div>
      <h1 class="premium-confirmation-title">Payment Successful!</h1>
      <p class="premium-confirmation-text">
        Thank you for your order. Your payment of ₹{{ amount }} has been processed successfully.
      </p>
      <p class="premium-confirmation-details">
        Order ID: #{{ generateOrderId() }}<br>
        Estimated Delivery: {{ getDeliveryDate() }}
      </p>
      <div class="premium-confirmation-actions">
        <router-link to="/product-list" class="btn premium-continue-btn">
          Continue Shopping
        </router-link>
        
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from './NavBar.vue';

export default {
  components: { NavBar },
  props: {
    amount: {
      type: String,
      default: '0.00'
    }
  },
  methods: {
    generateOrderId() {
      return 'ORD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    },
    getDeliveryDate() {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      return date.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    }
  }
};
</script>

<style scoped>
.premium-confirmation-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9d5ff;
  max-width: 600px;
  margin: 0 auto;
}

.premium-confirmation-icon {
  margin-bottom: 2rem;
}

.premium-success-gif {
  width: 300px;
  height: 300px;
  object-fit: contain;
}

.premium-confirmation-title {
  color: #28a745;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.premium-confirmation-text {
  font-size: 1.1rem;
  color: #495057;
  margin-bottom: 1.5rem;
}

.premium-confirmation-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.95rem;
  color: #6c757d;
  margin-bottom: 2rem;
}

.premium-confirmation-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.premium-continue-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
}



@media (max-width: 576px) {
  .premium-confirmation-card {
    padding: 2rem 1.5rem;
  }
  
  .premium-confirmation-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .premium-continue-btn {
    width: 100%;
  }
}
</style>