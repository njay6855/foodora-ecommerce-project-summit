import React, { useState, useEffect } from 'react';
import '../styles/AddToCart.css';

const AddToCart = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);


    // Listen for successful cart updates
    useEffect(() => {
        const handleCartUpdate = (event) => {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000); 
        };

        window.addEventListener('@food-ecommerce/cart-updated', handleCartUpdate);
        return () => {
        window.removeEventListener('@food-ecommerce/cart-updated', handleCartUpdate);
        };
    }, []);


  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.quantity) {
      setQuantity(value);
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
    
    //console.log('Dispatching add to cart event:', eventDetail);
    
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
      <div className="add-to-cart-input-group input-group">
        <span className="input-group-text">Quantity</span>
        <input
          type="number"
          className="form-control"
          value={quantity}
          onChange={handleQuantityChange}
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
