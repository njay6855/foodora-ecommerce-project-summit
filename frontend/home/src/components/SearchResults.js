import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from './ProductGrid';
import { homeService } from '../services/homeService';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = searchParams.get('q');

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const searchResults = await homeService.searchProducts(query);
        setProducts(searchResults);
      } catch (err) {
        setError('Failed to load search results');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Search Results for: {query}</h2>
      <ProductGrid products={products} loading={loading} error={error} />
    </div>
  );
};

export default SearchResults;
