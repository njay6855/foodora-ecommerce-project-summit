import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import { supplierService } from '../services/supplierService';
import '../styles/supplier.css';

const SupplierDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [isReturningFromForm, setIsReturningFromForm] = useState(false);

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
      setProducts(Array.isArray(productList) ? productList : []);
    } catch (err) {
      setError('Failed to load products');
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      await supplierService.addProduct(user.id, productData);
      setIsAddingProduct(false);
      setIsReturningFromForm(true);
    } catch (err) {
      setError('Failed to add product');
    }
  };

  const handleUpdateProduct = async (productData) => {
      try {
        await supplierService.updateProduct(user.id, editingProduct.id, productData);
        setEditingProduct(null);
        setIsReturningFromForm(true);
      } catch (err) {
        setError('Failed to update product');
      }
    };  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await supplierService.deleteProduct(user.id, productId);
        loadProducts();
      } catch (err) {
        setError('Failed to delete product');
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
        <div className="dashboard-header">
          <h2 className="dashboard-title">My Products</h2>
          <button
            className="supplier-btn supplier-btn-primary"
            onClick={() => setIsAddingProduct(true)}
          >
            Add New Product
          </button>
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
