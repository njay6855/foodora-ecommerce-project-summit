import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCartItems: (state, action) => {
      const items = Array.isArray(action.payload) ? action.payload : [];
      // Ensure each item has the necessary properties
      state.items = items.map(item => ({
        ...item,
        itemId: item.itemId,
        productId: item.productId ,
        name: item.name  || 'Unknown Product',
        imageUrl: item.imageUrl ||  '',
        price: item.price|| 0,
        quantity: item.quantity || 0
      }));
      state.total = calculateTotal(state.items);
      state.loading = false;
      state.error = null;
    },
    addItem: (state, action) => {
      const newItem = {
        productId: action.payload.productId,
        name: action.payload.name ||  'Unknown Product',
        imageUrl: action.payload.imageUrl ||  '',
        price: action.payload.price ||  0,
        quantity: action.payload.quantity || 1
      };

      const existingItem = state.items.find(item => item.productId === newItem.productId);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      state.total = calculateTotal(state.items);
    },
    updateItem: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
      state.total = calculateTotal(state.items);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      state.total = calculateTotal(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.error = null;
    },
  },
});

const calculateTotal = (items) => {
  if (!items) return 0;
  return items.reduce((sum, item) => {
    const price = item.price || item.product?.price || 0;
    const quantity = item.quantity || 0;
    return sum + (price * quantity);
  }, 0);
};

export const {
  setLoading,
  setError,
  setCartItems,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
