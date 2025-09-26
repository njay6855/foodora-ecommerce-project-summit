import React from 'react';

const ProductReviewCard = ({ product, onApprove, onReject }) => {

   

  return (
    <div className="review-card">
      <div className="review-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <h5 className="review-card-title">{product.name}</h5>
          <span className="review-status-badge">Pending Review</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <p className="review-content">{product.description}</p>
            
            <div className="review-detail">
              <span className="review-detail-label">Price:</span>
              <span className="review-detail-value">${product.price.toFixed(2)}</span>
            </div>

            <div className="review-detail">
              <span className="review-detail-label">Category:</span>
              <span className="review-detail-value">{product.categoryId}</span>
            </div>

            <div className="review-detail">
              <span className="review-detail-label">Supplier:</span>
              <span className="review-detail-value">{product.supplierId}</span>
            </div>
          </div>

          <div className="review-images">
            {product.images?.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`Product ${index + 1}`}
                className="review-image"
              />
            ))}
          </div>
        </div>

        <div className="steward-btn-group">
          <button
            className="steward-btn steward-btn-approve"
            onClick={() => onApprove(product.id)}
          >
            Approve
          </button>
          <button
            className="steward-btn steward-btn-reject"
            onClick={() => onReject(product.id)}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewCard;
