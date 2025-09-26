import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '@food-ecommerce/auth';
import { getCartState } from '@food-ecommerce/cart';
import '../styles/Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      try {
        //  Get current user from auth MFE
        const currentUser = getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          // Initialize cart count from cart MFE
          const cartState = getCartState();
          if (cartState) {
            const count = cartState.items.reduce((total, item) => total + item.quantity, 0);
            setCartCount(count);
          }
        }
      } catch (error) {
        console.error('Error fetching user or cart:', error);
      }
    };
    
    checkUser();

    // Listen for login event
    const handleUserLogin = (event) => {
      setUser(event.detail);
    };

    // Listen for logout event
    const handleUserLogout = () => {
      setUser(null);
    };

    window.addEventListener('@food-ecommerce/user-logged-in', handleUserLogin);
    window.addEventListener('@food-ecommerce/user-logged-out', handleUserLogout);
    
    // Listen for cart updates
    const handleCartUpdate = (event) => {
      setCartCount(event.detail.count);
    };
    
    window.addEventListener('@food-ecommerce/cart-updated', handleCartUpdate);

    return () => {
      window.removeEventListener('@food-ecommerce/user-logged-in', handleUserLogin);
      window.removeEventListener('@food-ecommerce/user-logged-out', handleUserLogout);
      window.removeEventListener('@food-ecommerce/cart-updated', handleCartUpdate);
    };
  }, []);
  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Foodora
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
           
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <>
                <Link 
                  to="/cart" 
                  className="btn cart-btn position-relative me-3"
                  style={{ fontSize: '1.25rem', textDecoration: 'none' }}
                >
                  <i className="bi bi-cart3" ></i>
                  {cartCount > 0 && (
                    <span 
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill cart-badge"
                      style={{ fontSize: '0.65rem' }}
                    >
                      {cartCount}
                      <span className="visually-hidden">items in cart</span>
                    </span>
                  )}
                </Link>

                <div className="dropdown">
                  <button 
                    className="btn profile-btn"
                    type="button" 
                    id="profileDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    style={{ fontSize: '1.25rem', textDecoration: 'none' }}
                  >
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="rounded-circle"
                        style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                      />
                    ) : (
                      <i className="bi bi-person-circle"></i>
                    )}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="profileDropdown">
                    <li className="dropdown-header">
                      <div className="fw-bold">{user.name}</div>
                      <div className="small text-muted">{user.email}</div>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/orders">
                        <i className="bi bi-box me-2"></i>
                        My Orders
                      </Link>
                    </li>
                    {user.role === 'Supplier' && (
                      <li>
                        <Link className="dropdown-item" to="/supplier">
                          <i className="bi bi-shop me-2"></i>
                          My Products
                        </Link>
                      </li>
                    )}
                    {user.role === 'DataSteward' && (
                      <li>
                        <Link className="dropdown-item" to="/data-steward">
                          <i className="bi bi-clock-history me-2"></i>
                          Pending Products
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={() => {
                          try {
                            logout();
                            navigate('/');
                          } catch (error) {
                            console.error('Logout error:', error);
                          }
                        }}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link 
                to="/auth/login" 
                className="btn btn-signin"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
