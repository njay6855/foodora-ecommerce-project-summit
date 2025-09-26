import React, { useState, useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import ProductGrid from './ProductGrid';
import { homeService } from '../services/homeService';
import '../styles/HomePage.css';

const HomePage = () => {

  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [randomProducts, categoriesData] = await Promise.all([
          homeService.getRandomProducts(),
          homeService.getCategories()
        ]);

        setRandomProducts(randomProducts);
        setCategories(categoriesData);

        // Fetch products for each category
        const productsByCategory = {};
        await Promise.all(
          categoriesData.map(async (category) => {
            try {
              const products = await homeService.getCategoryProducts(category.id);
              productsByCategory[category.id] = products;
            } catch (error) {
              console.error(`Error fetching products for category ${category.id}:`, error);
              productsByCategory[category.id] = [];
            }
          })
        );
        setCategoryProducts(productsByCategory);
      } catch (err) {
        setError('Failed to load content');
        setRandomProducts([]);
        setCategories([]);
        setCategoryProducts({});
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, [location]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container mt-4">
      {/* Search Section */}
      <div className="mb-5">
        <SearchBar />
      </div>

      {/* Random/Best Selling Products Section */}
      <section className="mb-5">
        <h2 className="mb-4">Best Selling Products</h2>
        <ProductGrid products={randomProducts} />
      </section>

      {/* Products by Category Sections */}
      {categories.map(category => (
        <section key={category.id} className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>{category.name}</h2>
            <Link 
              to={`/category/${category.id}`} 
              className="btn view-all-btn"
            >
              View All
            </Link>
          </div>
          <ProductGrid 
            products={categoryProducts[category.id] || []} 
            loading={!categoryProducts[category.id]}
          />
        </section>
      ))}
    </div>
  );
};

export default HomePage;
