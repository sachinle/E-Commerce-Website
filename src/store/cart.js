
import { reactive } from 'vue';

const state = reactive({
  items: []
});

const cart = {
  getItems() {
    return state.items;
  },

  getCount() {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  },

  addItem(newItem) {
    const existing = state.items.find(item => item.id === newItem.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.items.push({ ...newItem, quantity: 1 });
    }
  },

  decreaseQuantity(id) {
    const item = state.items.find(i => i.id === id);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
    }
  },

  removeItem(id) {
    const index = state.items.findIndex(item => item.id === id);
    if (index !== -1) {
      state.items.splice(index, 1);
    }
  },

  clearCart() {
    state.items.splice(0);
  }
};

export default cart;
