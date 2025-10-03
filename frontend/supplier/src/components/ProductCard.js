import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/supplier.css';

const ProductCard = ({ product: initialProduct, onEdit, onDelete, onUpdateStock }) => {
  const [product, setProduct] = useState(initialProduct);
  const [localQuantity, setLocalQuantity] = useState(initialProduct.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    setProduct(initialProduct);
    setLocalQuantity(initialProduct.quantity);
  }, [initialProduct]);

  const handleStockUpdate = async (newValue) => {
    const newStock = parseInt(newValue);
    if (!isNaN(newStock) && newStock >= 0 && !isUpdating && newStock !== product.quantity) {
      setIsUpdating(true);
      try {
        const result = await onUpdateStock(product.id, newStock);
        if (typeof result === 'object' && result !== null) {
          
          setProduct(prevProduct => ({
            ...prevProduct,
            ...result,
            categoryName: result.categoryName || prevProduct.categoryName
          }));
          setLocalQuantity(result.quantity || newStock);
        } else {
          setProduct(prevProduct => ({
            ...prevProduct,
            quantity: newStock
          }));
          setLocalQuantity(newStock);
        }
      } catch (error) {
        setLocalQuantity(product.quantity);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || !isNaN(parseInt(value))) {
      setLocalQuantity(value);
    }
  };

  const handleQuantitySubmit = () => {
    const newQuantity = parseInt(localQuantity);
    if (!isNaN(newQuantity) && newQuantity >= 0 && newQuantity !== product.quantity) {
      handleStockUpdate(newQuantity);
    } else {
      setLocalQuantity(product.quantity); 
    }
  };

  return (
    <div className="col-md-6 mb-4">
      <div className="product-card">
        <div className="product-card-body">
          <div className="d-flex justify-content-between align-items-start">
            <h5 className="product-card-title">{product.name}</h5>
            <span className={`status-badge ${
              product.status === 'Approved' 
                ? 'status-badge-approved' 
                : product.status === 'Rejected'
                ? 'status-badge-rejected'
                : 'status-badge-pending'
            }`}>
              {product.status === 'Approved' 
                ? 'Approved' 
                : product.status === 'Rejected'
                ? 'Rejected'
                : 'Pending Approval'}
            </span>
          </div>

          <div className="product-content-row">
            <div className="product-details-column">
              <p className="product-card-text">{product.description}</p>
              
              <div className="product-detail">
                <span className="product-detail-label">Price:</span>
                <span>${product.price.toFixed(2)}</span>
              </div>
            </div>

      
            <div className="note-column">
              {(product.status === 'Approved' || product.status === 'Rejected') && product.stewardNote && (
                <div className={`data-steward-note-side ${product.status === 'Rejected' ? 'data-steward-note-rejected' : ''}`}>
                  <div className="data-steward-note-header-side">
                    <i className="fas fa-user-tie"></i>
                    <span className="note-title-side">Data Steward Note:</span>
                  </div>
                  <p className="note-content-side">{product.stewardNote}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="supplier-form-group">
            <label className="supplier-form-label">Stock Quantity:</label>
            <div className="quantity-control">
              <button
                type="button"
                className="quantity-btn"
                onClick={() => {
                  if (product.quantity > 0) {
                    const newValue = product.quantity - 1;
                    handleStockUpdate(newValue);
                  }
                }}
                disabled={product.quantity <= 0 || isUpdating}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                className="supplier-form-control quantity-input"
                value={localQuantity}
                onChange={handleInputChange}
                onBlur={handleQuantitySubmit}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== 'Enter') {
                    e.preventDefault();
                  }
                  if (e.key === 'Enter') {
                    e.target.blur(); 
                  }
                }}
                min="0"
                pattern="[0-9]*"
              />
              <button
                type="button"
                className="quantity-btn"
                onClick={() => {
                  const newValue = product.quantity + 1;
                  handleStockUpdate(newValue);
                }}
                disabled={isUpdating}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="product-detail">
            <span className="product-detail-label">Category:</span>
            <span>{product.categoryName}</span>
          </div>

          <div className="supplier-btn-group">
            <button
              className="supplier-btn supplier-btn-primary"
              onClick={() => onEdit(product)}
            >
              Edit
            </button>
            <button
              className="supplier-btn supplier-btn-danger"
              onClick={() => onDelete(product.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
