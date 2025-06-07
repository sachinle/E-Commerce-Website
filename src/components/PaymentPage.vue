<template>
  <NavBar />
  <div class="container my-5 premium-payment">
    <div class="row">
      <div class="col-lg-7">
        <div class="premium-payment-card">
          <h2 class="premium-payment-title">
            <i class="fas fa-lock me-2"></i> Secure Payment
          </h2>
          
          <div class="premium-steps">
            <div class="premium-step completed">
              <span class="premium-step-number">1</span>
              <span class="premium-step-text">Cart</span>
            </div>
            <div class="premium-step completed">
              <span class="premium-step-number">2</span>
              <span class="premium-step-text">Details</span>
            </div>
            <div class="premium-step active">
              <span class="premium-step-number">3</span>
              <span class="premium-step-text">Payment</span>
            </div>
            <div class="premium-step">
              <span class="premium-step-number">4</span>
              <span class="premium-step-text">Complete</span>
            </div>
          </div>
          
          <div class="premium-payment-methods">
            <h5 class="premium-section-title">Select Payment Method</h5>
            <div class="premium-method-options">
              <div class="form-check premium-method-option" 
                   v-for="method in paymentMethods" 
                   :key="method.id">
                <input class="form-check-input" 
                       type="radio" 
                       name="paymentMethod" 
                       :id="'method-' + method.id"
                       v-model="selectedMethod" 
                       :value="method.id">
                <label class="form-check-label" :for="'method-' + method.id">
                  <img :src="method.icon" :alt="method.name" class="premium-method-icon">
                  <span>{{ method.name }}</span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- Card Payment Form -->
          <div v-if="selectedMethod === 'card'" class="premium-card-form">
            <h5 class="premium-section-title">Card Details</h5>
            <div class="mb-3">
              <label class="form-label premium-input-label">Card Number</label>
              <div class="premium-input-group">
                <input type="text" 
                       class="form-control premium-input" 
                       placeholder="1234 5678 9012 3456"
                       v-model="cardDetails.number"
                       @input="formatCardNumber"
                       required>
                <span class="premium-card-type">
                  <i class="fab fa-cc-visa" v-if="cardType === 'visa'"></i>
                  <i class="fab fa-cc-mastercard" v-else-if="cardType === 'mastercard'"></i>
                  <i class="far fa-credit-card" v-else></i>
                </span>
              </div>
              <small class="text-danger" v-if="errors.cardNumber">{{ errors.cardNumber }}</small>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label premium-input-label">Expiry Date</label>
                <input type="text" 
                       class="form-control premium-input" 
                       placeholder="MM/YY"
                       v-model="cardDetails.expiry"
                       @input="formatExpiryDate"
                       required>
                <small class="text-danger" v-if="errors.cardExpiry">{{ errors.cardExpiry }}</small>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label premium-input-label">CVV</label>
                <div class="premium-input-group">
                  <input type="password" 
                         class="form-control premium-input" 
                         placeholder="123"
                         v-model="cardDetails.cvv"
                         required>
                  <span class="premium-cvv-help" 
                        data-bs-toggle="tooltip" 
                        title="3-digit code on back of card">
                    <i class="fas fa-question-circle"></i>
                  </span>
                </div>
                <small class="text-danger" v-if="errors.cardCvv">{{ errors.cardCvv }}</small>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label premium-input-label">Cardholder Name</label>
              <input type="text" 
                     class="form-control premium-input" 
                     placeholder="Name on card"
                     v-model="cardDetails.name"
                     required>
              <small class="text-danger" v-if="errors.cardName">{{ errors.cardName }}</small>
            </div>
          </div>

          <!-- UPI Payment Form -->
          <div v-if="selectedMethod === 'upi'" class="premium-upi-form">
            <h5 class="premium-section-title">UPI Details</h5>
            <div class="mb-3">
              <label class="form-label premium-input-label">UPI ID</label>
              <input type="text" 
                     class="form-control premium-input" 
                     placeholder="yourname@upi"
                     v-model="upiDetails.id"
                     @input="validateUpiId"
                     required>
              <small class="text-danger" v-if="errors.upiId">{{ errors.upiId }}</small>
            </div>
            <div class="premium-upi-apps">
              <div class="premium-upi-app" 
                   v-for="app in upiApps" 
                   :key="app.id"
                   @click="selectUpiApp(app.id)"
                   :class="{ active: upiDetails.app === app.id }">
                <img :src="app.icon" :alt="app.name">
                <span>{{ app.name }}</span>
              </div>
            </div>
          </div>
          
          <!-- Net Banking Form -->
          <div v-if="selectedMethod === 'netbanking'" class="premium-netbanking-form">
            <h5 class="premium-section-title">Select Bank</h5>
            <select class="form-select premium-input" 
                    v-model="netbankingDetails.bank"
                    required>
              <option value="" disabled selected>Select your bank</option>
              <option v-for="bank in banks" :key="bank.id" :value="bank.id">{{ bank.name }}</option>
            </select>
            <small class="text-danger" v-if="errors.bank">{{ errors.bank }}</small>
          </div>
          
          <!-- Terms and Conditions -->
          <div class="form-check premium-terms">
            <input class="form-check-input" 
                   type="checkbox" 
                   id="termsCheck" 
                   v-model="acceptTerms"
                   required>
            <label class="form-check-label" for="termsCheck">
              I agree to the <a href="#" @click.prevent="showTerms">Terms & Conditions</a>
            </label>
            <small class="text-danger d-block" v-if="errors.terms">{{ errors.terms }}</small>
          </div>
          
          <!-- Payment Button -->
          <button class="btn premium-pay-btn" 
                  @click="validateAndProcessPayment"
                  :disabled="!isFormValid || processing">
            <span v-if="!processing">
              Pay ₹{{ grandTotal.toFixed(2) }} Now
            </span>
            <span v-else>
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Processing...
            </span>
          </button>
          
          <div class="premium-secure-info">
            <i class="fas fa-lock"></i>
            <span>Your payment is securely encrypted</span>
          </div>
        </div>
      </div>
      
      <!-- Order Summary Column -->
      <div class="col-lg-5">
        <div class="premium-order-summary">
          <h3 class="premium-summary-title">Order Summary</h3>
          
          <div class="premium-order-items">
            <div class="premium-order-item" v-for="item in cartItems" :key="item.id">
              <div class="premium-item-image">
                <img :src="item.image" :alt="item.title">
              </div>
              <div class="premium-item-details">
                <h6 class="premium-item-title">{{ item.title }}</h6>
                <p class="premium-item-price">₹{{ item.price.toFixed(2) }} × {{ item.quantity }}</p>
              </div>
              <div class="premium-item-total">
                ₹{{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>
          
          <div class="premium-price-breakdown">
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
          </div>
          
          <div class="premium-delivery-info">
            <h5 class="premium-info-title">
              <i class="fas fa-truck me-2"></i> Delivery Information
            </h5>
            <p class="premium-info-text">
              <strong>Address:</strong> Rathinam Technical Campus Pollachi Rd, Eachanari, Coimbatore Tamil Nadu 641021<br>
              <strong>Estimated Delivery:</strong> 2-3 business days
            </p>
          </div>
        </div>
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
      shipping: 50,
      selectedMethod: 'card',
      paymentMethods: [
        { id: 'card', name: 'Credit/Debit Card', icon: 'https://cdn-icons-png.flaticon.com/512/196/196578.png' },
        { id: 'upi', name: 'UPI Payment', icon: 'https://cdn-icons-png.flaticon.com/512/825/825454.png' },
        { id: 'netbanking', name: 'Net Banking', icon: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png' },
        { id: 'wallet', name: 'Wallet', icon: 'https://cdn-icons-png.flaticon.com/512/2503/2503650.png' }
      ],
      upiApps: [
        { id: 'gpay', name: 'Google Pay', icon: 'https://cdn-icons-png.flaticon.com/512/2504/2504739.png' },
        { id: 'phonepe', name: 'PhonePe', icon: 'https://cdn-icons-png.flaticon.com/512/3649/3649706.png' },
        { id: 'paytm', name: 'Paytm', icon: 'https://cdn-icons-png.flaticon.com/512/825/825454.png' },
        { id: 'amazonpay', name: 'Amazon Pay', icon: 'https://cdn-icons-png.flaticon.com/512/2504/2504928.png' }
      ],
      banks: [
        { id: 'sbi', name: 'State Bank of India' },
        { id: 'hdfc', name: 'HDFC Bank' },
        { id: 'icici', name: 'ICICI Bank' },
        { id: 'axis', name: 'AXIS Bank' },
        { id: 'kotak', name: 'Kotak Mahindra Bank' }
      ],
      cardDetails: {
        number: '',
        expiry: '',
        cvv: '',
        name: ''
      },
      upiDetails: {
        id: '',
        app: 'gpay'
      },
      netbankingDetails: {
        bank: ''
      },
      acceptTerms: false,
      processing: false,
      errors: {
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        cardName: '',
        upiId: '',
        bank: '',
        terms: ''
      }
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
    },
    cardType() {
      if (/^4/.test(this.cardDetails.number)) return 'visa';
      if (/^5[1-5]/.test(this.cardDetails.number)) return 'mastercard';
      return '';
    },
    isFormValid() {
      // Check if all required fields are filled based on selected payment method
      if (!this.acceptTerms) return false;
      
      switch (this.selectedMethod) {
        case 'card':
          return this.cardDetails.number && 
                 this.cardDetails.expiry && 
                 this.cardDetails.cvv && 
                 this.cardDetails.name &&
                 !this.errors.cardNumber &&
                 !this.errors.cardExpiry &&
                 !this.errors.cardCvv;
        case 'upi':
          return this.upiDetails.id && 
                 this.upiDetails.app &&
                 !this.errors.upiId;
        case 'netbanking':
          return this.netbankingDetails.bank;
        default:
          return false;
      }
    }
  },
  methods: {
    selectUpiApp(appId) {
      this.upiDetails.app = appId;
    },
    
    validateAndProcessPayment() {
      if (!this.validateForm()) {
        return;
      }
      
      this.processing = true;
      
      // Simulate payment processing with timeout
      setTimeout(() => {
        this.processing = false;
        this.$router.push({
          name: 'OrderConfirmation',
          query: { amount: this.grandTotal.toFixed(2) }
        });
        cart.clearCart();
        eventBus.emit('cart-updated', 0);
      }, 3000); // 3 second timeout for simulation
    },
    
    validateForm() {
      this.clearErrors();
      let isValid = true;
      
      // Validate terms
      if (!this.acceptTerms) {
        this.errors.terms = 'You must accept the terms and conditions';
        isValid = false;
      }
      
      // Validate based on payment method
      switch (this.selectedMethod) {
        case 'card':
          if (!this.cardDetails.number) {
            this.errors.cardNumber = 'Card number is required';
            isValid = false;
          } else if (!this.isValidCardNumber(this.cardDetails.number)) {
            this.errors.cardNumber = 'Invalid card number';
            isValid = false;
          }
          
          if (!this.cardDetails.expiry) {
            this.errors.cardExpiry = 'Expiry date is required';
            isValid = false;
          } else if (!this.isValidExpiryDate(this.cardDetails.expiry)) {
            this.errors.cardExpiry = 'Invalid expiry date (MM/YY)';
            isValid = false;
          }
          
          if (!this.cardDetails.cvv) {
            this.errors.cardCvv = 'CVV is required';
            isValid = false;
          } else if (!this.isValidCvv(this.cardDetails.cvv)) {
            this.errors.cardCvv = 'Invalid CVV (3-4 digits)';
            isValid = false;
          }
          
          if (!this.cardDetails.name) {
            this.errors.cardName = 'Cardholder name is required';
            isValid = false;
          }
          break;
          
        case 'upi':
          if (!this.upiDetails.id) {
            this.errors.upiId = 'UPI ID is required';
            isValid = false;
          } else if (!this.isValidUpiId(this.upiDetails.id)) {
            this.errors.upiId = 'Invalid UPI ID (e.g., name@upi)';
            isValid = false;
          }
          break;
          
        case 'netbanking':
          if (!this.netbankingDetails.bank) {
            this.errors.bank = 'Please select a bank';
            isValid = false;
          }
          break;
      }
      
      return isValid;
    },
    
    clearErrors() {
      this.errors = {
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        cardName: '',
        upiId: '',
        bank: '',
        terms: ''
      };
    },
    
    // Validation helpers
    isValidCardNumber(number) {
      const cleaned = number.replace(/\s+/g, '');
      return /^[0-9]{13,16}$/.test(cleaned);
    },
    
    isValidExpiryDate(expiry) {
      if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
      
      const [month, year] = expiry.split('/').map(Number);
      if (month < 1 || month > 12) return false;
      
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;
      
      return true;
    },
    
    isValidCvv(cvv) {
      return /^[0-9]{3,4}$/.test(cvv);
    },
    
    isValidUpiId(upiId) {
      return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId);
    },
    
    // Formatting helpers
    formatCardNumber(event) {
      let value = event.target.value.replace(/\s+/g, '');
      if (value.length > 16) value = value.substring(0, 16);
      
      // Add space after every 4 digits
      value = value.replace(/(\d{4})/g, '$1 ').trim();
      this.cardDetails.number = value;
      
      // Validate as user types
      if (value && !this.isValidCardNumber(value)) {
        this.errors.cardNumber = 'Invalid card number';
      } else {
        this.errors.cardNumber = '';
      }
    },
    
    formatExpiryDate(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length > 4) value = value.substring(0, 4);
      
      // Add slash after 2 digits
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      this.cardDetails.expiry = value;
      
      // Validate as user types
      if (value && !this.isValidExpiryDate(value)) {
        this.errors.cardExpiry = 'Invalid expiry date';
      } else {
        this.errors.cardExpiry = '';
      }
    },
    
    validateUpiId() {
      if (this.upiDetails.id && !this.isValidUpiId(this.upiDetails.id)) {
        this.errors.upiId = 'Invalid UPI ID';
      } else {
        this.errors.upiId = '';
      }
    },
    
    showTerms() {
      alert('Terms and conditions would be displayed here');
    }
  }
};
</script>

<style scoped>
/* Add this to your existing styles */
.text-danger {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.premium-input:invalid {
  border-color: #dc3545;
}

.premium-pay-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Base styles */
.premium-payment {
  max-width: 1400px;
  margin: 0 auto;
}

.premium-payment-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9d5ff;
  margin-bottom: 2rem;
}

.premium-payment-title {
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
}

/* Progress steps */
.premium-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  position: relative;
}

.premium-steps::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.premium-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.premium-step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.premium-step-text {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.premium-step.completed .premium-step-number {
  background: #4f46e5;
  color: white;
}

.premium-step.completed .premium-step-text {
  color: #4f46e5;
}

.premium-step.active .premium-step-number {
  background: #a78bfa;
  color: white;
  box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.3);
}

.premium-step.active .premium-step-text {
  color: #4f46e5;
  font-weight: 600;
}

/* Payment methods */
.premium-section-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.premium-method-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.premium-method-option {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.premium-method-option:hover {
  border-color: #a78bfa;
}

.premium-method-option .form-check-input {
  margin-top: 0.2rem;
}

.premium-method-option .form-check-label {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.premium-method-icon {
  width: 30px;
  height: auto;
  margin-right: 12px;
}

/* Form inputs */
.premium-input-label {
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
  display: block;
}

.premium-input {
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.premium-input:focus {
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
}

.premium-input-group {
  position: relative;
}

.premium-card-type {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: #64748b;
}

.premium-cvv-help {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  cursor: help;
}

/* UPI Apps */
.premium-upi-apps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.premium-upi-app {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.premium-upi-app:hover {
  border-color: #a78bfa;
}

.premium-upi-app.active {
  border-color: #4f46e5;
  background: #f5f3ff;
}

.premium-upi-app img {
  width: 40px;
  height: 40px;
  margin-bottom: 0.5rem;
}

.premium-upi-app span {
  font-size: 0.8rem;
  text-align: center;
}

/* Terms and conditions */
.premium-terms {
  margin: 2rem 0;
}

.premium-terms .form-check-input {
  margin-right: 0.5rem;
}

.premium-terms a {
  color: #4f46e5;
  text-decoration: none;
}

.premium-terms a:hover {
  text-decoration: underline;
}

/* Pay button */
.premium-pay-btn {
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  width: 100%;
  padding: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  margin-bottom: 1.5rem;
}

.premium-pay-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
}

.premium-pay-btn:disabled {
  background: #cbd5e0;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

/* Secure info */
.premium-secure-info {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.9rem;
}

.premium-secure-info i {
  color: #10b981;
  margin-right: 0.5rem;
}

/* Order summary */
.premium-order-summary {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9d5ff;
  position: sticky;
  top: 20px;
}

.premium-summary-title {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 1rem;
}

.premium-order-items {
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.premium-order-item {
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.premium-item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
}

.premium-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.premium-item-details {
  flex-grow: 1;
}

.premium-item-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.premium-item-price {
  color: #64748b;
  font-size: 0.85rem;
  margin: 0;
}

.premium-item-total {
  font-weight: 600;
  color: #2d3748;
  min-width: 70px;
  text-align: right;
}

.premium-price-breakdown {
  margin: 1.5rem 0;
  padding: 1.5rem 0;
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
}

.premium-price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #4a5568;
}

.premium-total-row {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  font-weight: 600;
  color: #2d3748;
}

.premium-grand-total {
  font-weight: 700;
  color: #4f46e5;
  font-size: 1.2rem;
}

.premium-delivery-info {
  margin-top: 1.5rem;
}

.premium-info-title {
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.premium-info-text {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .premium-method-options {
    grid-template-columns: 1fr;
  }
  
  .premium-upi-apps {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .premium-payment-card,
  .premium-order-summary {
    padding: 1.5rem;
  }
  
  .premium-payment-title {
    font-size: 1.5rem;
  }
  
  .premium-step-text {
    font-size: 0.75rem;
  }
}
</style>