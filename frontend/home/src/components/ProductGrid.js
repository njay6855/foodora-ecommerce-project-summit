import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductGrid.css';

const ProductCard = ({ product }) => {
  return (
    <div className="col-md-3 mb-4">
      <div className="card h-100 product-card">
        {product.imageUrls && product.imageUrls.length > 0 && (
          <img
            src={product.imageUrls[0]}
            className="card-img-top product-image"
            alt={product.name}
          />
        )}
        <div className="card-body product-body">
          <h5 className="product-title">{product.name}</h5>
          <p className="product-description text-truncate">{product.description}</p>
          <p className="product-price">
            ${product.price.toFixed(2)}
          </p>
          <Link
            to={`/product/${product.id}`}
            className="view-details-btn"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center my-5 product-grid-loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert product-grid-error" role="alert">
        {error}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="alert product-grid-empty" role="alert">
        No products found.
      </div>
    );
  }

  return (
    <div className="product-grid">
      <div className="container">
        <div className="row">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
