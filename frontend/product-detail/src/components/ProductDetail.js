import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productDetailService } from '../services/productDetailService';
import ProductGallery from './ProductGallery';
import RelatedProducts from './RelatedProducts';
import AddToCart from './AddToCart';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    loadProductDetails();
  }, [productId]);

  const loadProductDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const productData = await productDetailService.getProductById(productId);
      setProduct(productData);
      console.log('Product Data:', productData);

      // Load related products
      if (productData.categoryId) {
        const relatedData = await productDetailService.getRelatedProducts(
          productData.categoryId,
          productId
        );
        setRelatedProducts(relatedData.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" role="alert">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="product-breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/category/${product.categoryId}`}>
                {product.categoryName}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Product Images */}
          <div className="col-md-6 mb-4">
            <ProductGallery imageUrls={product.imageUrls || []} />
          </div>

          {/* Product Info */}
          <div className="col-md-6">
            <div className='product-info-container'>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price">${product.price?.toFixed(2)}</p>
            
            <div className="mb-4">
              <h5>Description</h5>
              <p>{product.description}</p>
            </div>

            <div className="mb-4">
              <h5>Category</h5>
              <Link 
                to={`/category/${product.categoryId}`}
                className="text-decoration-none"
              >
                <span className="badge bg-secondary p-2 fs-6">
                  {product.categoryName}
                </span>
              </Link>
            </div>

            <div className="mb-4">
              <h5>Producer Information</h5>
              <p>{product.supplier?.name}</p>
              <p className="text-muted">{product.supplier?.location}</p>
            </div>

            <AddToCart product={product} />

            </div>
            
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts 
          products={relatedProducts}
          currentProductId={productId} 
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
