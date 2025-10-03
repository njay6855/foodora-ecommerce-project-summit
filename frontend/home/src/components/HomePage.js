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
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    priceRange: { min: '', max: '' }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        const allProductsList = [];
        
        await Promise.all(
          categoriesData.map(async (category) => {
            try {
              const products = await homeService.getCategoryProducts(category.id);
              productsByCategory[category.id] = products;
              allProductsList.push(...products);
            } catch (error) {
              console.error(`Error fetching products for category ${category.id}:`, error);
              productsByCategory[category.id] = [];
            }
          })
        );
        
        setCategoryProducts(productsByCategory);
        setAllProducts(allProductsList);
        setFilteredProducts(allProductsList);
      } catch (err) {
        setError('Failed to load content');
        setRandomProducts([]);
        setCategories([]);
        setCategoryProducts({});
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, [location]);

  // Filter products based on active filters
  const applyFilters = () => {
    let filtered = [...allProducts];

    // Filter by category
    if (activeFilters.category) {
      filtered = filtered.filter(product => product.categoryId === activeFilters.category);
    }

    // Filter by price range
    if (activeFilters.priceRange.min !== '') {
      filtered = filtered.filter(product => product.price >= parseFloat(activeFilters.priceRange.min));
    }
    if (activeFilters.priceRange.max !== '') {
      filtered = filtered.filter(product => product.price <= parseFloat(activeFilters.priceRange.max));
    }

    setFilteredProducts(filtered);
  };

  // Handle category filter
  const handleCategoryFilter = (categoryId) => {
    setActiveFilters(prev => ({
      ...prev,
      category: prev.category === categoryId ? null : categoryId
    }));
  };

  // Handle price range filter
  const handlePriceFilter = (minPrice, maxPrice) => {
    setActiveFilters(prev => ({
      ...prev,
      priceRange: { min: minPrice, max: maxPrice }
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({
      category: null,
      priceRange: { min: '', max: '' }
    });
  };

  // Apply filters when activeFilters change
  useEffect(() => {
    applyFilters();
  }, [activeFilters, allProducts]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="home-page-wrapper">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h3>Filters</h3>
          <button 
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>
        
        <div className="sidebar-content">
          {/* Category Filter */}
          <div className="filter-section">
            <h4>Categories</h4>
            <div className="category-filters">
              <button 
                className={`category-filter-btn ${!activeFilters.category ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(null)}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-filter-btn ${activeFilters.category === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryFilter(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-filters">
              <div className="price-input-group">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={activeFilters.priceRange.min}
                  onChange={(e) => setActiveFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, min: e.target.value }
                  }))}
                  className="price-input"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={activeFilters.priceRange.max}
                  onChange={(e) => setActiveFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, max: e.target.value }
                  }))}
                  className="price-input"
                />
              </div>
              <button 
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Filter Results Summary */}
          <div className="filter-summary">
            <p>{filteredProducts.length} products found</p>
            {(activeFilters.category || activeFilters.priceRange.min || activeFilters.priceRange.max) && (
              <div className="active-filters">
                {activeFilters.category && (
                  <span className="filter-tag">
                    Category: {categories.find(c => c.id === activeFilters.category)?.name}
                    <button onClick={() => handleCategoryFilter(null)}>×</button>
                  </span>
                )}
                {(activeFilters.priceRange.min || activeFilters.priceRange.max) && (
                  <span className="filter-tag">
                    Price: ${activeFilters.priceRange.min || '0'} - ${activeFilters.priceRange.max || '∞'}
                    <button onClick={() => handlePriceFilter('', '')}>×</button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="container mt-4">
          {/* Search and Filter Section */}
          <div className="search-filter-section mb-5">
            <div className="d-flex align-items-center gap-3">
              <button 
                className="filter-toggle-btn btn btn-primary d-flex align-items-center"
                onClick={() => setSidebarOpen(true)}
              >
                <i className="fas fa-filter me-2"></i>
                <span>Filters</span>
              </button>
              <div className="flex-grow-1">
                <SearchBar />
              </div>
            </div>
          </div>

          {/* Show filtered products if filters are active */}
          {(activeFilters.category || activeFilters.priceRange.min || activeFilters.priceRange.max) ? (
            <section className="mb-5">
              <h2 className="mb-4">
                Filtered Products 
                <span className="text-muted ms-2">({filteredProducts.length} found)</span>
              </h2>
              <ProductGrid products={filteredProducts} />
            </section>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
