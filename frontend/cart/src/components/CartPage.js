import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import '../styles/CartPage.css';
import { setLoading, setError, setCartItems, clearCart } from '../store/cartSlice';
import { cartService } from '../services/cartService';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error, total } = useSelector((state) => state.cart);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        setUser(currentUser);
        if (currentUser) {
          loadCart(currentUser.id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        dispatch(setError('Failed to authenticate user'));
      }
    };

    initializeUser();
  }, []);



  const loadCart = async (userId) => {
    dispatch(setLoading(true));
    try {
      const cart = await cartService.getCart(userId);
      const cartItems = cart.items  || [];
      dispatch(setCartItems(cartItems));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartService.clearCart(user.id);
        dispatch(clearCart());
        window.dispatchEvent(new CustomEvent('@food-ecommerce/cart-updated', {
          detail: {
            count: 0
          }
        }));
      } catch (error) {
        dispatch(setError('Failed to clear cart'));
      }
    }
  };

  if (!user) {
    return (
      <div className="cart-page-container">
        <div className="container">
          <div className="cart-login-prompt">
            Please <Link to="/auth/login">login</Link> to view your cart.
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-page-container">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border cart-loading" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page-container">
        <div className="container">
          <div className="cart-alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page-container">
        <div className="container">
          <div className="cart-empty-container">
            <h2 className="cart-empty-title">Your cart is empty</h2>
            <Link to="/" className="cart-continue-shopping btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="cart-items-container">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="cart-header">Shopping Cart ({items.length} items)</h2>
                <button
                  className="btn cart-clear-btn"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>

              {error && (
                <div className="cart-alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {items.map((item) => (
                <CartItem key={item.itemId} item={item} userId={user.id} />
              ))}

              <div className="mt-4">
                <Link to="/" className="btn cart-continue-shopping">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
