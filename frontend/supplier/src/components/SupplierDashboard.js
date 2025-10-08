import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import { supplierService } from '../services/supplierService';
import '../styles/supplier.css';

const SupplierDashboard = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
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
    loadAllProducts();
    loadProducts();
  }, []);

  useEffect(() => {
    if (isReturningFromForm) {
      loadAllProducts();
      loadProducts(statusFilter);
      setIsReturningFromForm(false);
    }
  }, [isReturningFromForm]);

  const loadAllProducts = async () => {
    try {
      const response = await supplierService.getSupplierProducts(user.id);
      // Handle nested data structure from BFF
      const productList = response.data?.data || response.data || response;
      const validProducts = Array.isArray(productList) ? productList : [];
      setAllProducts(validProducts);
    } catch (err) {
      console.error('Failed to load all products for counts:', err);
    }
  };

  const loadProducts = async (status = 'all') => {
    setLoading(true);
    setError(null);
    try {
      const params = status && status !== 'all' ? { status: mapStatusFilter(status) } : {};
      console.log('Loading products with params:', params); // Debug log
      const response = await supplierService.getSupplierProducts(user.id, params);
      console.log('Response received:', response); // Debug log
      // Handle nested data structure from BFF
      const productList = response.data?.data || response.data || response;
      const validProducts = Array.isArray(productList) ? productList : [];
      console.log('Valid products:', validProducts); // Debug log
      setProducts(validProducts);
    } catch (err) {
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const mapStatusFilter = (filter) => {
    switch (filter) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return null;
    }
  };

  const handleStatusFilterChange = (filter) => {
    setStatusFilter(filter);
    loadProducts(filter);
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
    const productList = allProducts.length > 0 ? allProducts : products;
    const counts = {
      all: productList.length,
      approved: productList.filter(p => p.status === 'Approved').length,
      pending: productList.filter(p => p.status === 'Pending' || p.status === 'Pending Approval').length,
      rejected: productList.filter(p => p.status === 'Rejected').length
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
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={setEditingProduct}
              onDelete={handleDeleteProduct}
              onUpdateStock={handleUpdateStock}
            />
          ))}
        </div>

        {products.length === 0 && !error && allProducts.length > 0 && (
          <div className="empty-state">
            <p>No products found for the selected status.</p>
          </div>
        )}

        {allProducts.length === 0 && products.length === 0 && !error && (
          <div className="empty-state">
            <p>No products found. Start by adding a new product.</p>
          </div>
        )}


      </div>
    </div>
  );
};

export default SupplierDashboard;
