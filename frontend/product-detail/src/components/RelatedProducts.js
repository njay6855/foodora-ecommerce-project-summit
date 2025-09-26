import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/RelatedProducts.css';

const RelatedProducts = ({ products, currentProductId, loading, error }) => {
  if (loading) {
    return (
      <div className="related-products-loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show error for related products
  }

  const filteredProducts = products?.filter(product => product.id != currentProductId);

  if (!filteredProducts?.length) {
    return null;
  }

  return (
    <div className="related-products-section">
      <h3 className="related-products-title">Related Products</h3>
      <div className="row">
        {filteredProducts.map(product => (
          <div key={product.id} className="col-md-3 mb-4">
            <div className="related-product-card h-100">
              {product.imageUrls && product.imageUrls.length > 0 && (
                <img
                  src={product.imageUrls[0]}
                  className="related-product-image w-100"
                  alt={product.name}
                />
              )}
              <div className="related-product-body">
                <h5 className="related-product-title text-truncate">{product.name}</h5>
                <p className="related-product-price mb-3">
                  ${product.price.toFixed(2)}
                </p>
                <Link
                  to={`/product/${product.id}`}
                  className="related-product-link"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
