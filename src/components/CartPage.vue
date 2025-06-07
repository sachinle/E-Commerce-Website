<template>
  <NavBar />
  <div class="container my-5 premium-cart">
    <h2 class="premium-title">Your Shopping Cart</h2>
    
    <div v-if="cartItems.length > 0">
      <div class="premium-cart-header">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h5 class="premium-subtitle">{{ cartItems.length }} Item(s) in Cart</h5>
          </div>
          <div class="col-md-6 text-end">
            <router-link to="/product-list" class="premium-continue-shopping">
              <i class="fas fa-arrow-left me-2"></i> Continue Shopping
            </router-link>
          </div>
        </div>
      </div>

      <div class="premium-cart-items">
        <div class="premium-cart-item" v-for="item in cartItems" :key="item.id">
          <div class="row align-items-center">
            <div class="col-md-2">
              <img :src="item.image" class="premium-product-image" :alt="item.title">
            </div>
            <div class="col-md-4">
              <h5 class="premium-product-title">{{ item.title }}</h5>
              <p class="premium-product-category">{{ item.category }}</p>
            </div>
            <div class="col-md-2">
              <div class="premium-quantity-selector">
                <button @click="decreaseQuantity(item)" class="premium-quantity-btn">
                  <i class="fas fa-minus"></i>
                </button>
                <span class="premium-quantity">{{ item.quantity }}</span>
                <button @click="increaseQuantity(item)" class="premium-quantity-btn">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
            <div class="col-md-2 text-center">
              <p class="premium-product-price">₹{{ item.price.toFixed(2) }}</p>
            </div>
            <div class="col-md-2 text-end">
              <p class="premium-product-total">₹{{ (item.price * item.quantity).toFixed(2) }}</p>
              <button @click="removeItem(item.id)" class="premium-remove-btn">
                <i class="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="premium-summary">
        <div class="row">
          <div class="col-md-6">
            <div class="premium-coupon-box">
              <h5 class="premium-summary-title">Apply Coupon</h5>
              <div class="input-group">
                <input type="text" class="form-control premium-coupon-input" placeholder="Enter coupon code">
                <button class="btn premium-coupon-btn">Apply</button>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="premium-price-details">
              <h5 class="premium-summary-title">Order Summary</h5>
              <div class="premium-price-row">
                <span>Subtotal</span>
                <span>₹{{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="premium-price-row">
                <span>Shipping</span>
                <span>₹{{ shipping.toFixed(2) }}</span>
              </div>
              <div class="premium-price-row">
                <span>GST ({{ gstRate }}%)</span>
                <span>₹{{ gstAmount.toFixed(2) }}</span>
              </div>
              <div class="premium-price-row premium-total-row">
                <span>Total Amount</span>
                <span class="premium-grand-total">₹{{ grandTotal.toFixed(2) }}</span>
              </div>
              
              
            

              <router-link to="/payment" class="btn premium-checkout-btn"><button class="btn premium-checkout-btn">
  <i class="fas fa-lock me-2"></i> Proceed to Secure Checkout  </button>
</router-link>
              <div class="premium-payment-methods">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" width="40">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" alt="Mastercard" width="40">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="PayPal" width="40">
                <img src="https://cdn-icons-png.flaticon.com/512/825/825454.png" alt="UPI" width="40">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="premium-empty-cart">
      <div class="premium-empty-content">
        <i class="fas fa-shopping-cart premium-empty-icon"></i>
        <h3 class="premium-empty-title">Your Cart is Empty</h3>
        <p class="premium-empty-text">Looks like you haven't added anything to your cart yet</p>
        <router-link to="/product-list" class="btn premium-shopping-btn">
          Continue Shopping
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from './NavBar.vue';
import cart from '@/store/cart';
import eventBus from '@/eventBus';

export default {
  components: { NavBar },
  data() {
    return {
      gstRate: 18,
      shipping: 50
    };
  },
  computed: {
    cartItems() {
      return cart.getItems();
    },
    subtotal() {
      return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    gstAmount() {
      return (this.subtotal * this.gstRate) / 100;
    },
    grandTotal() {
      return this.subtotal + this.gstAmount + this.shipping;
    }
  },
  methods: {
    increaseQuantity(item) {
      cart.addItem(item);
      eventBus.emit('cart-updated', cart.getCount());
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        cart.decreaseQuantity(item.id);
      } else {
        this.removeItem(item.id);
      }
      eventBus.emit('cart-updated', cart.getCount());
    },
    removeItem(id) {
      cart.removeItem(id);
      eventBus.emit('cart-updated', cart.getCount());
    }
  }
};
</script>


<style scoped>

.premium-cart {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  max-width: 1200px;
  margin: auto;
}

.premium-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  color: #2d3748;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 1rem;
}

.premium-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #a78bfa);
  border-radius: 2px;
}

.premium-cart-header {
  background: #f8fafc;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.premium-subtitle {
  font-weight: 600;
  color: #4a5568;
  margin: 0;
}

.premium-continue-shopping {
  color: #4f46e5;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.premium-continue-shopping:hover {
  color: #4338ca;
  text-decoration: underline;
}


.premium-cart-items {
  margin-bottom: 3rem;
}

.premium-cart-item {
  padding: 1.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.premium-cart-item:last-child {
  border-bottom: none;
}

.premium-product-image {
  width: 100%;
  max-width: 100px;
  height: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.premium-product-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.premium-product-category {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}


.premium-quantity-selector {
  display: inline-flex;
  align-items: center;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  overflow: hidden;
}

.premium-quantity-btn {
  background: #f8fafc;
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.premium-quantity-btn:hover {
  background: #e2e8f0;
}

.premium-quantity {
  width: 40px;
  text-align: center;
  font-weight: 500;
}

.premium-product-price {
  font-weight: 600;
  color: #4a5568;
  margin: 0;
}

.premium-product-total {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.premium-remove-btn {
  background: none;
  border: none;
  color: #e53e3e;
  font-size: 0.85rem;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.premium-remove-btn:hover {
  color: #c53030;
  text-decoration: underline;
}


.premium-summary {
  background: #f8fafc;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
}

.premium-summary-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.75rem;
}

.premium-summary-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: #4f46e5;
  border-radius: 2px;
}

.premium-coupon-box {
  margin-bottom: 2rem;
}

.premium-coupon-input {
  border: 1px solid #cbd5e0;
  border-right: none;
  height: 45px;
}

.premium-coupon-input:focus {
  box-shadow: none;
  border-color: #cbd5e0;
}

.premium-coupon-btn {
  background: #4f46e5;
  color: white;
  border: none;
  height: 45px;
  padding: 0 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.premium-coupon-btn:hover {
  background: #4338ca;
}

.premium-price-details {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.premium-price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #4a5568;
}

.premium-total-row {
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  margin-top: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.premium-grand-total {
  font-weight: 700;
  color: #4f46e5;
  font-size: 1.2rem;
}

.premium-checkout-btn {
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  width: 100%;
  padding: 10px;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 0.01rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.premium-checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
}

.premium-payment-methods {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.premium-payment-methods img {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.premium-payment-methods img:hover {
  opacity: 1;
}

.premium-empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  text-align: center;
}

.premium-empty-content {
  max-width: 400px;
}

.premium-empty-icon {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
}

.premium-empty-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.premium-empty-text {
  color: #718096;
  margin-bottom: 2rem;
}

.premium-shopping-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.premium-shopping-btn:hover {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

@media (max-width: 768px) {
  .premium-cart {
    padding: 1.5rem;
  }
  
  .premium-cart-item {
    padding: 1rem 0;
  }
  
  .premium-product-title {
    font-size: 1rem;
  }
  
  .premium-summary {
    padding: 1.5rem;
  }
}
</style>