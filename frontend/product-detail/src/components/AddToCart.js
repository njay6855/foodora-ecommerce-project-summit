import React, { useState, useEffect } from 'react';
import '../styles/AddToCart.css';

const AddToCart = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [localQuantity, setLocalQuantity] = useState('1'); 
  const [addedToCart, setAddedToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Listen for successful cart updates
  useEffect(() => {
    const handleCartUpdate = (event) => {
      setAddedToCart(true);
      setShowToast(true);
      
      setTimeout(() => setAddedToCart(false), 2000);
      
      setTimeout(() => setShowToast(false), 3000);
    };

    window.addEventListener('@food-ecommerce/cart-updated', handleCartUpdate);
    return () => {
      window.removeEventListener('@food-ecommerce/cart-updated', handleCartUpdate);
    };
  }, []);


  const handleQuantityInput = (e) => {
    setLocalQuantity(e.target.value);
  };

  const handleQuantityBlur = (e) => {
    
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.quantity) {
      setQuantity(value);
      setLocalQuantity(value.toString());
    } else {
      setLocalQuantity(quantity.toString());
    }
  };

  const handleQuantityKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuantityBlur(e);
    }
  };

  const handleAddToCart = () => {
    const eventDetail = {
      productId: product.id,
      quantity: quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0]?.url
      }
    };
    
    // Dispatch custom event for cart microfrontend
    window.dispatchEvent(
      new CustomEvent('@food-ecommerce/add-to-cart', {
        detail: eventDetail,
        bubbles: true,
        composed: true
      })
    );

  };

  return (
    <div className="add-to-cart-container">
      {/* Toast Notification */}
      {showToast && (
        <div className="cart-toast">
          <div className="toast-content">
            <span className="toast-icon">✓</span>
            <span className="toast-message">
              <strong>{product.name}</strong> added to cart!
            </span>
          </div>
        </div>
      )}
      
      <div className="add-to-cart-input-group input-group">
        <span className="input-group-text">Quantity</span>
        <input
          type="number"
          className="form-control"
          value={localQuantity}
          onChange={handleQuantityInput}
          onBlur={handleQuantityBlur}
          onKeyPress={handleQuantityKeyPress}
          min="1"
          max={product.quantity}
        />
      </div>
      
      <button
        className={`add-to-cart-btn btn ${addedToCart ? 'success' : ''} success-transition`}
        onClick={handleAddToCart}
        disabled={product.quantity === 0 || addedToCart}
      >
        <span className={`${addedToCart ? 'd-none' : ''}`}>
          {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </span>
        <span className={`${addedToCart ? '' : 'd-none'} d-flex align-items-center justify-content-center`}>
          <span className="check-icon">✓</span>Added to Cart!
        </span>
      </button>
      
      {product.quantity > 0 && (
        <small className="stock-info mt-2 d-block">
          {product.quantity} units available
        </small>
      )}
    </div>
  );
};

export default AddToCart;
