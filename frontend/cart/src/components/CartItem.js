import React, { useState } from 'react';
import {  useDispatch } from 'react-redux';
import { updateItem, removeItem } from '../store/cartSlice';
import { cartService } from '../services/cartService';
import { getStore } from '../store';
import '../styles/CartItem.css';

// Helper function to dispatch cart update event
const dispatchCartUpdateEvent = () => {
  const store = getStore();
  const cartState = store.getState().cart;
  const totalCount = cartState.items.reduce((total, item) => total + item.quantity, 0);
  
  window.dispatchEvent(new CustomEvent('@food-ecommerce/cart-updated', {
    detail: {
      count: totalCount
    }
  }));
};

const CartItem = ({ item, userId }) => {
  const dispatch = useDispatch();
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  const handleQuantityInput = (e) => {
    setLocalQuantity(e.target.value);
  };

  const handleQuantityBlur = async (e) => {
    // Update backend and Redux store when user finishes typing
    const quantity = parseInt(e.target.value);
    if (quantity > 0 && quantity !== item.quantity) {
      try {
        await cartService.updateCartItem(userId, item.itemId, quantity);
        dispatch(updateItem({ productId: item.productId, quantity }));
        dispatchCartUpdateEvent();
      } catch (error) {
        console.error('Failed to update quantity:', error);
        // Reset to original quantity on error
        setLocalQuantity(item.quantity);
      }
    } else if (quantity <= 0) {
      // Reset to original quantity if invalid
      setLocalQuantity(item.quantity);
    }
  };

  const handleRemove = async () => {
    try {
      await cartService.removeCartItem(userId, item.itemId);
      dispatch(removeItem(item.productId));
      dispatchCartUpdateEvent();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  return (
    <div className="cart-item">
      <div className="row g-0">
        <div className="col-md-2">
          <div className="cart-item-image-container">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                className="cart-item-image"
                alt={item.name}
              />
            )}
          </div>
        </div>
        <div className="col-md-10">
          <div className="cart-item-content">
            <div className="row align-items-center">
              <div className="col-md-4">
                <h5 className="cart-item-title">{item.name}</h5>
                <p className="cart-item-unit-price">
                  ${item.price.toFixed(2)} per unit
                </p>
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="cart-item-quantity"
                  value={localQuantity}
                  onChange={handleQuantityInput}
                  onBlur={handleQuantityBlur}
                  min="1"
                />
              </div>
              <div className="col-md-3">
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
              <div className="col-md-2">
                <button
                  className="cart-item-remove"
                  onClick={handleRemove}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
