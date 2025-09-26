import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import ProductGrid from './ProductGrid';
import {categoryService} from '../services/categoryService';
import '../styles/CategoryPage.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [name, categoryProducts] = await Promise.all([
          categoryService.getCategoryName(categoryId),
          categoryService.getCategoryProducts(categoryId)
        ]);

        if (!name) {
          throw new Error('Category not found');
        }
        setCategoryName(name);
        setProducts(categoryProducts);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId]);

  if (!categoryName) return <div className="alert alert-info m-3">Category not found</div>;

  return (
    <div className="category-page-container">
      <div className="container">
        <SearchBar />
        
        <nav aria-label="breadcrumb" className="category-breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {categoryName}
            </li>
          </ol>
        </nav>

        <h2 className="category-title">{categoryName}</h2>

        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CategoryPage;
