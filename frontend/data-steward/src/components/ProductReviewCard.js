import React, { useState } from 'react';

const ProductReviewCard = ({ product, onApprove, onReject }) => {
  const [stewardNote, setStewardNote] = useState('');

  const handleApprove = () => {
    onApprove(product.id, stewardNote);
  };

  const handleReject = () => {
    onReject(product.id, stewardNote);
  };

  return (
    <div className="review-card">
      <div className="review-card-body">
        <div className="review-two-column-layout">
          <div className="product-details-column">
            <h5 className="review-card-title" style={{ marginBottom: '1rem' }}>{product.name}</h5>
            <p className="review-content">{product.description}</p>
            
            <div className="review-detail">
              <span className="review-detail-label">Price:</span>
              <span className="review-detail-value">${product.price.toFixed(2)}</span>
            </div>

            <div className="review-detail">
              <span className="review-detail-label">Category:</span>
              <span className="review-detail-value">{product.categoryName}</span>
            </div>

            <div className="review-detail">
              <span className="review-detail-label">Supplier:</span>
              <span className="review-detail-value">{product.supplierName}</span>
            </div>
          </div>

          <div className="status-images-column">
            <span className="review-status-badge">Pending Review</span>
            <div className="review-images-right">
              {product.imageUrls?.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Product ${index + 1}`}
                  className="review-image-right"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Data Steward Note Section */}
        <div className="steward-note-section">
          <label className="steward-note-label" htmlFor={`note-${product.id}`}>
            Data Steward Note:
          </label>
          <textarea
            id={`note-${product.id}`}
            className="steward-note-input"
            value={stewardNote}
            onChange={(e) => setStewardNote(e.target.value)}
            placeholder="Enter your review note (optional)..."
            rows="3"
          />
        </div>

        <div className="steward-btn-group">
          <button
            className="steward-btn steward-btn-approve"
            onClick={handleApprove}
          >
            Approve
          </button>
          <button
            className="steward-btn steward-btn-reject"
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewCard;
