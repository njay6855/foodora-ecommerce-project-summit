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
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();
  const user = getCurrentUser(); 

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

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  const handleApprove = async (productId, stewardNote) => {
    try {
      const product = products.find(p => p.id === productId);
      await dataStewardService.approveProduct(productId, stewardNote);
      setProducts(products.filter(p => p.id !== productId));
      showToast(`Product "${product?.name || 'Unknown'}" has been approved successfully!`, 'success');
    } catch (err) {
      setError('Failed to approve product');
      showToast('Failed to approve product. Please try again.', 'error');
    }
  };

  const handleReject = async (productId, stewardNote) => {
    try {
      const product = products.find(p => p.id === productId);
      await dataStewardService.rejectProduct(productId, stewardNote);
      setProducts(products.filter(p => p.id !== productId));
      showToast(`Product "${product?.name || 'Unknown'}" has been rejected.`, 'success');
    } catch (err) {
      setError('Failed to reject product');
      showToast('Failed to reject product. Please try again.', 'error');
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

        {/* Toast Notification */}
        {toast.show && (
          <div className={`steward-toast steward-toast-${toast.type}`}>
            <div className="toast-content">
              <span className="toast-icon">
                {toast.type === 'success' ? '✓' : '⚠'}
              </span>
              <span className="toast-message">{toast.message}</span>
            </div>
          </div>
        )}

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
