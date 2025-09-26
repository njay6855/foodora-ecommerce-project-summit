import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductReviewCard from './ProductReviewCard';
import { dataStewardService } from '../services/dataStewardService';
import { getCurrentUser } from '@food-ecommerce/auth';
import '../styles/data-steward.css';

const DataStewardDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = getCurrentUser(); // Get user from auth

  useEffect(() => {
    if (!user || user.role !== 'DataSteward') {
      navigate('/auth/login');
      return;
    }
    loadPendingProducts();
  }, []);

  const loadPendingProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataStewardService.getPendingProducts();
      setProducts(Array.isArray(data) ? data : []);
      if (!Array.isArray(data)) {
        setError('Received invalid data format from server');
      }
    } catch (err) {
      setError(err.message || 'Failed to load pending products');
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    try {
      await dataStewardService.approveProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      setError('Failed to approve product');
    }
  };

  const handleReject = async (productId) => {
    try {
      await dataStewardService.rejectProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      setError('Failed to reject product');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="steward-container">
      <div className="container">
        <h2 className="steward-header">Products Pending Review</h2>

        {error && (
          <div className="steward-error">
            {error}
          </div>
        )}

        {products.length === 0 ? (
          <div className="steward-info">
            No products pending review at this time.
          </div>
        ) : (
          products.map(product => (
            <ProductReviewCard
              key={product.id}
              product={product}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DataStewardDashboard;
