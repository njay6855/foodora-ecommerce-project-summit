import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../styles/CartSummary.css';

const CartSummary = () => {
  const { items, total } = useSelector((state) => state.cart);
  
 
  const subtotal = total;
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
  const finalTotal = subtotal + tax + shipping;

  return (
    <div className="cart-summary">
      <h5 className="cart-summary-title">Order Summary</h5>
      
      <div className="cart-summary-row">
        <span className="cart-summary-label">Subtotal ({items.length} items)</span>
        <span className="cart-summary-value">${subtotal.toFixed(2)}</span>
      </div>
      
      <div className="cart-summary-row">
        <span className="cart-summary-label">Tax (10%)</span>
        <span className="cart-summary-value">${tax.toFixed(2)}</span>
      </div>
      
      <div className="cart-summary-row">
        <span className="cart-summary-label">Shipping</span>
        <span className="cart-summary-value">
          {shipping === 0 ? (
            <span className="cart-summary-shipping-free">FREE</span>
          ) : (
            `$${shipping.toFixed(2)}`
          )}
        </span>
      </div>
      
      <div className="cart-summary-divider" />
      
      <div className="cart-summary-row cart-summary-total">
        <span>Total</span>
        <span>${finalTotal.toFixed(2)}</span>
      </div>

      {shipping > 0 && (
        <div className="cart-summary-shipping-alert">
          Add ${(50 - subtotal).toFixed(2)} more to get free shipping!
        </div>
      )}

      <Link
        to="/checkout"
        className="cart-summary-checkout-btn"
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default CartSummary;
