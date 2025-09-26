import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-title">About Foodora</h5>
            <p className="footer-text">
              Your trusted partner for fresh, quality food products delivered right to your doorstep. 
              Supporting local suppliers and bringing you the best culinary experiences.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/products" className="footer-link">Products</Link></li>
              <li><Link to="/cart" className="footer-link">Cart</Link></li>
              <li><Link to="/auth/login" className="footer-link">Sign In</Link></li>
              <li><Link to="/auth/register" className="footer-link">Register</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Categories</h5>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Fruits & Vegetables</a></li>
              <li><a href="#" className="footer-link">Dairy Products</a></li>
              <li><a href="#" className="footer-link">Meat & Seafood</a></li>
              <li><a href="#" className="footer-link">Bakery Items</a></li>
              <li><a href="#" className="footer-link">Beverages</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Support</h5>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Help Center</a></li>
              <li><a href="#" className="footer-link">Contact Us</a></li>
              <li><a href="#" className="footer-link">Shipping Info</a></li>
              <li><a href="#" className="footer-link">Returns</a></li>
              <li><a href="#" className="footer-link">Track Order</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-title">Contact Info</h5>
            <div className="contact-info">
              <div className="contact-item">
                <i className="bi bi-geo-alt-fill"></i>
                <span>123 Food Street, Culinary City, FC 12345</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-telephone-fill"></i>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-envelope-fill"></i>
                <span>support@foodora.com</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-clock-fill"></i>
                <span>Mon-Sun: 6:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Bottom Section */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="footer-copyright">
              © {currentYear} Foodora. All rights reserved.
            </p>
          </div>
          <div className="col-md-6">
            <div className="footer-legal">
              <a href="#" className="footer-link me-3">Privacy Policy</a>
              <a href="#" className="footer-link me-3">Terms of Service</a>
              <a href="#" className="footer-link">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;