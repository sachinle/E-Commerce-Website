<template>
  <nav class="navbar navbar-expand-lg premium-navbar">
    <router-link class="navbar-brand premium-brand" to="/"><strong>Leo's E-Shop</strong></router-link>
    <button class="navbar-toggler" type="button" @click="isCollapsed = !isCollapsed" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    
    <div class="collapse navbar-collapse justify-content-end" :class="{ show: isCollapsed }" id="navbarNav">
      <ul class="navbar-nav mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link class="nav-link premium-link" to="/">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link premium-link" to="/product-list">Products</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link premium-link" to="/cart">
            Cart <i class="fa-solid fa-cart-shopping"></i> <span class="badge premium-badge">{{ cartCount }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import eventBus from '@/eventBus'
import cart from '@/store/cart' 

export default {
  setup() {
    const cartCount = ref(cart.getCount())
    const isCollapsed = ref(false)

    const updateCart = (newCount) => {
      cartCount.value = newCount
    }

    onMounted(() => {
      eventBus.on('cart-updated', updateCart)
    })

    onBeforeUnmount(() => {
      eventBus.off('cart-updated', updateCart)
    })

    return {
      cartCount,
      isCollapsed
    }
  }
}
</script>

<style scoped>

.premium-navbar {
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
  padding: 0.8rem 2.5rem;
  transition: all 0.3s ease;
}

.premium-brand {
  font-family: 'Montserrat', 'Segoe UI', sans-serif;
  font-size: 1.8rem;
  color: #ffd700 !important;
  letter-spacing: 1.8px;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(255, 215, 0, 0.25);
  position: relative;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
}

.premium-brand::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #ffd700, #ffffff);
  transition: width 0.3s ease;
}

.premium-brand:hover::after {
  width: 100%;
}

.premium-link {
  font-weight: 600;
  color: #e6e6e6 !important;
  padding: 0.5rem 1.2rem !important;
  margin: 0 0.3rem;
  position: relative;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.5px;
}

.premium-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #ffd700, #fff9c4);
  transition: all 0.3s ease;
}

.premium-link:hover {
  color: #ffd700 !important;
  transform: translateY(-2px);
}

.premium-link:hover::before {
  width: 70%;
}


.premium-link.router-link-exact-active {
  color: #ffd700 !important;
  font-weight: 700;
}

.premium-link.router-link-exact-active::before {
  width: 70%;
  background: #ffd700;
}


.premium-badge {
  background: linear-gradient(135deg, #ffd700 0%, #fff9c4 100%) !important;
  color: #8a6d00 !important;
  font-weight: 700;
  padding: 0.25em 0.6em;
  border-radius: 50px;
  font-size: 0.75rem;
  margin-left: 6px;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  transform: translateY(-1px);
  border: none;
  min-width: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.navbar-toggler {
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 0.5rem;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Cpath stroke='rgba(255, 215, 0, 0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

@media (max-width: 991.98px) {
  .premium-navbar {
    padding: 0.8rem 1.5rem;
  }
  
  .premium-brand {
    font-size: 1.5rem;
  }
  
  .navbar-collapse {
    background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
    padding: 1rem;
    margin-top: 0.5rem;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .premium-link {
    margin: 0.5rem 0;
    padding: 0.8rem 1rem !important;
    border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  }
  
  .premium-link:hover {
    transform: translateX(5px);
  }
}


@keyframes goldPulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
}

.premium-badge:hover {
  animation: goldPulse 1.5s infinite;
}
</style>