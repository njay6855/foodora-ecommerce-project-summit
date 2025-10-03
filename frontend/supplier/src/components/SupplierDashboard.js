import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import { supplierService } from '../services/supplierService';
import '../styles/supplier.css';

const SupplierDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [isReturningFromForm, setIsReturningFromForm] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  useEffect(() => {
    if (!user || user.role !== 'Supplier') {
      navigate('/auth/login');
      return;
    }
    loadProducts();
  }, []);

  useEffect(() => {
    if (isReturningFromForm) {
      loadProducts();
      setIsReturningFromForm(false);
    }
  }, [isReturningFromForm]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await supplierService.getSupplierProducts(user.id);
      const productList = response.data ;
      const validProducts = Array.isArray(productList) ? productList : [];
      setProducts(validProducts);
      filterProducts(validProducts, statusFilter);
    } catch (err) {
      setError('Failed to load products');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (productList, filter) => {
    let filtered;
    switch (filter) {
      case 'approved':
        filtered = productList.filter(product => product.status === 'Approved');
        break;
      case 'pending':
        filtered = productList.filter(product => 
          product.status === 'Pending' || product.status === 'Pending Approval'
        );
        break;
      case 'rejected':
        filtered = productList.filter(product => product.status === 'Rejected');
        break;
      default:
        filtered = productList;
    }
    setFilteredProducts(filtered);
  };

  const handleStatusFilterChange = (filter) => {
    setStatusFilter(filter);
    filterProducts(products, filter);
  };

  const handleAddProduct = async (productData) => {
    try {
      await supplierService.addProduct(user.id, productData);
      setIsAddingProduct(false);
      setIsReturningFromForm(true);
      showToast(`Product "${productData.name}" has been added successfully!`, 'success');
    } catch (err) {
      setError('Failed to add product');
      showToast('Failed to add product. Please try again.', 'error');
    }
  };

  const getProductCounts = () => {
    const counts = {
      all: products.length,
      approved: products.filter(p => p.status === 'Approved').length,
      pending: products.filter(p => p.status === 'Pending' || p.status === 'Pending Approval').length,
      rejected: products.filter(p => p.status === 'Rejected').length
    };
    return counts;
  };

  const handleUpdateProduct = async (productData) => {
      try {
        await supplierService.updateProduct(user.id, editingProduct.id, productData);
        const productName = editingProduct.name || productData.name;
        setEditingProduct(null);
        setIsReturningFromForm(true);
        showToast(`Product "${productName}" has been updated successfully!`, 'success');
      } catch (err) {
        setError('Failed to update product');
        showToast('Failed to update product. Please try again.', 'error');
      }
    };  const handleDeleteProduct = async (productId) => {
    const product = products.find(p => p.id === productId);
    const productName = product?.name || 'Unknown';
    
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await supplierService.deleteProduct(user.id, productId);
        loadProducts();
        showToast(`Product "${productName}" has been deleted successfully!`, 'success');
      } catch (err) {
        setError('Failed to delete product');
        showToast('Failed to delete product. Please try again.', 'error');
      }
    }
  };

  const handleUpdateStock = async (productId, stockQuantity) => {
    try {
      const response = await supplierService.updateProductStock(user.id, productId, stockQuantity);
      if (response && response.data) {
        return response.data;
      }
      return true;
    } catch (err) {
      setError('Failed to update stock');
      throw err; 
    }
  };

  if (loading) {
    return (
      <div className="supplier-container">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAddingProduct || editingProduct) {
    return (
      <div className="supplier-container">
        <div className="container">
          <ProductForm
            product={editingProduct}
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
            onCancel={() => {
              setIsAddingProduct(false);
              setEditingProduct(null);
              setIsReturningFromForm(true);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-container">
      <div className="container">
        {/* Toast Notification */}
        {toast.show && (
          <div className={`supplier-toast supplier-toast-${toast.type}`}>
            <div className="toast-content">
              <span className="toast-icon">
                {toast.type === 'success' ? '✓' : '⚠'}
              </span>
              <span className="toast-message">{toast.message}</span>
            </div>
          </div>
        )}

        <div className="dashboard-header">
          <h2 className="dashboard-title">My Products</h2>
          <button
            className="supplier-btn supplier-btn-primary"
            onClick={() => setIsAddingProduct(true)}
          >
            Add New Product
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="status-filter-container">
          <div className="status-filter-tabs">
            {(() => {
              const counts = getProductCounts();
              return (
                <>
                  <button
                    className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => handleStatusFilterChange('all')}
                  >
                    All Products
                    <span className="tab-count">({counts.all})</span>
                  </button>
                  <button
                    className={`status-tab ${statusFilter === 'approved' ? 'active' : ''}`}
                    onClick={() => handleStatusFilterChange('approved')}
                  >
                    Approved
                    <span className="tab-count">({counts.approved})</span>
                  </button>
                  <button
                    className={`status-tab ${statusFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => handleStatusFilterChange('pending')}
                  >
                    Pending
                    <span className="tab-count">({counts.pending})</span>
                  </button>
                  <button
                    className={`status-tab ${statusFilter === 'rejected' ? 'active' : ''}`}
                    onClick={() => handleStatusFilterChange('rejected')}
                  >
                    Rejected
                    <span className="tab-count">({counts.rejected})</span>
                  </button>
                </>
              );
            })()}
          </div>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="row">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={setEditingProduct}
              onDelete={handleDeleteProduct}
              onUpdateStock={handleUpdateStock}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && !error && products.length > 0 && (
          <div className="empty-state">
            <p>No products found for the selected status.</p>
          </div>
        )}

        {products.length === 0 && !error && (
          <div className="empty-state">
            <p>No products found. Start by adding a new product.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;
