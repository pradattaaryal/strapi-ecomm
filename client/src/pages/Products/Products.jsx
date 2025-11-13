import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Card from "../../components/Card/Card";
import "./Products.scss";

const Products = () => {
  const catId = parseInt(useParams().id) || null;

  // ------------------ STATE ------------------
  const [filters, setFilters] = useState({
    search: "",
    category: [],
    minPrice: 0,
    maxPrice: 10000,
    isNew: null,
    sortBy: "price:asc",
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
  });

  // ------------------ DEBOUNCE EFFECT ------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      // Reset to page 1 when filters change
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [filters]);

  // ------------------ BUILD QUERY ------------------
  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();

    if (catId) params.append("categoryId", catId);
    if (debouncedFilters.search) params.append("search", debouncedFilters.search);
    if (debouncedFilters.category.length) params.append("category", debouncedFilters.category.join(","));
    if (debouncedFilters.minPrice > 0) params.append("minPrice", debouncedFilters.minPrice);
    if (debouncedFilters.maxPrice < 10000) params.append("maxPrice", debouncedFilters.maxPrice);
    if (debouncedFilters.isNew !== null) params.append("isNew", debouncedFilters.isNew);
    if (debouncedFilters.sortBy) params.append("sortBy", debouncedFilters.sortBy);

    params.append("page", pagination.page);
    params.append("pageSize", pagination.pageSize);

    return `/products/filter?${params.toString()}`;
  }, [debouncedFilters, pagination, catId]);

  // ------------------ FETCH ENDPOINT ------------------
  const [endpoint, setEndpoint] = useState(buildQuery());

  useEffect(() => {
    setEndpoint(buildQuery());
  }, [buildQuery]);

  const { data, loading, error } = useFetch(endpoint);

  // Debug: Remove in production
  useEffect(() => {
    console.log("Fetched data:", data);
  }, [data]);

  // ------------------ PAGINATION ------------------
  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Detect if more pages exist
  const hasMore = Array.isArray(data) && data.length === pagination.pageSize;

  // ------------------ RENDER ------------------
  return (
    <div className="products-page" style={{
      display: 'flex',
      gap: '40px',
      padding: '30px',
      maxWidth: '1400px',
      margin: '0 auto',
      minHeight: '80vh'
    }}>
      {/* LEFT: FILTER SIDEBAR */}
      <div className="left" style={{
        flex: '0 0 280px',
        borderRight: '1px solid #e8e8e8',
        paddingRight: '30px'
      }}>
        {/* Search */}
        <div className="filterItem" style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Search</h2>
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '2px solid #e8e8e8',
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#000'}
            onBlur={(e) => e.target.style.borderColor = '#e8e8e8'}
          />
        </div>

        {/* Price Range */}
        <div className="filterItem" style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Price Range</h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <span style={{
              fontSize: '13px',
              color: '#666',
              fontWeight: '500'
            }}>$0</span>
            <input
              type="range"
              min="0"
              max="10000"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxPrice: Number(e.target.value),
                }))
              }
              style={{
                flex: 1,
                cursor: 'pointer',
                accentColor: '#000'
              }}
            />
            <span style={{
              fontSize: '13px',
              color: '#000',
              fontWeight: '600',
              minWidth: '65px',
              textAlign: 'right'
            }}>${filters.maxPrice}</span>
          </div>
          {filters.maxPrice !== debouncedFilters.maxPrice && (
            <div style={{
              fontSize: '11px',
              color: '#999',
              fontStyle: 'italic',
              marginTop: '4px'
            }}>Updating...</div>
          )}
        </div>

        {/* Sort By */}
        <div className="filterItem" style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Sort By</h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
            cursor: 'pointer'
          }}>
            <input
              type="radio"
              id="asc"
              name="sort"
              value="price:asc"
              checked={filters.sortBy === "price:asc"}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
              }
              style={{ cursor: 'pointer', accentColor: '#000' }}
            />
            <label htmlFor="asc" style={{
              cursor: 'pointer',
              fontSize: '14px',
              color: '#333',
              userSelect: 'none'
            }}>Price: Low to High</label>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}>
            <input
              type="radio"
              id="desc"
              name="sort"
              value="price:desc"
              checked={filters.sortBy === "price:desc"}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
              }
              style={{ cursor: 'pointer', accentColor: '#000' }}
            />
            <label htmlFor="desc" style={{
              cursor: 'pointer',
              fontSize: '14px',
              color: '#333',
              userSelect: 'none'
            }}>Price: High to Low</label>
          </div>
        </div>

        {/* New Arrival */}
        <div className="filterItem">
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Status</h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              id="isNew"
              checked={filters.isNew || false}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  isNew: e.target.checked ? true : null,
                }))
              }
              style={{ cursor: 'pointer', accentColor: '#000' }}
            />
            <label htmlFor="isNew" style={{
              cursor: 'pointer',
              fontSize: '14px',
              color: '#333',
              userSelect: 'none'
            }}>New Arrivals Only</label>
          </div>
        </div>
      </div>

      {/* RIGHT: PRODUCT GRID */}
      <div className="right" style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: 0
          }}>Products</h1>
          {!loading && !error && Array.isArray(data) && (
            <span style={{
              fontSize: '14px',
              color: '#666',
              fontWeight: '500'
            }}>
              Showing {data.length} items
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px'
          }}>
            <div style={{
              fontSize: '16px',
              color: '#999',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #000',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Loading products...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            padding: '20px',
            backgroundColor: '#fee',
            borderRadius: '8px',
            color: '#c33',
            textAlign: 'center'
          }}>
            Error: {error.message}
          </div>
        )}

        {/* Success: Render Cards */}
        {!loading && !error && Array.isArray(data) && data.length > 0 && (
          <>
            <div className="product-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '24px',
             // background:"red",
              display:"flex",
              justifyContent:"space-between",
              marginBottom: '40px'
            }}>
              {data.map((item) => (
                <Card
                  key={item.documentId || item.id}
                  item={item}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              paddingTop: '20px',
              borderTop: '1px solid #e8e8e8'
            }}>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={{
                  backgroundColor: pagination.page === 1 ? '#e8e8e8' : '#000',
                  color: pagination.page === 1 ? '#999' : '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  minWidth: '80px'
                }}
                onMouseEnter={(e) => {
                  if (pagination.page !== 1) e.target.style.backgroundColor = '#333';
                }}
                onMouseLeave={(e) => {
                  if (pagination.page !== 1) e.target.style.backgroundColor = '#000';
                }}
              >
                Previous
              </button>
              <span style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#1a1a1a',
                minWidth: '80px',
                textAlign: 'center'
              }}>
                Page {pagination.page}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!hasMore}
                style={{
                  backgroundColor: !hasMore ? '#e8e8e8' : '#000',
                  color: !hasMore ? '#999' : '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: !hasMore ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  minWidth: '80px'
                }}
                onMouseEnter={(e) => {
                  if (hasMore) e.target.style.backgroundColor = '#333';
                }}
                onMouseLeave={(e) => {
                  if (hasMore) e.target.style.backgroundColor = '#000';
                }}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && (!data || data.length === 0) && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            color: '#999',
            gap: '12px'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ fontSize: '18px', fontWeight: '500' }}>No products found</p>
            <p style={{ fontSize: '14px' }}>Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Add spinning animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Products;