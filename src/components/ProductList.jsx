import React, { useEffect, useRef, useState } from "react";

const productPerPage = 10;

const ProductList = () => {
  const [product, setProduct] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/products?limit=${productPerPage}&skip=${page * productPerPage}`
        );
        const data = await response.json();
        
        if (data.products.length === 0) {
          setHasMore(false);
        } else {
          setProduct((prevProduct) => [
            ...prevProduct,
            ...data.products,
          ]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [page]);

  useEffect(() => {
    const onIntersection = (items) => {
      const loaderItem = items[0];
      if (loaderItem.isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const observer = new IntersectionObserver(onIntersection);

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore]);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Product List</h2>
      
      {/* Card Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        {product.map((item) => (
          <div key={item.id} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Product Image */}
            <img 
              src={item.thumbnail} 
              alt={item.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            
            {/* Product Info */}
            <div style={{ padding: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{item.title}</h3>
              <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
                {item.description.substring(0, 80)}...
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
                  ${item.price}
                </span>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  ⭐ {item.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div ref={loaderRef} style={{ textAlign: 'center', padding: '20px', fontSize: '18px' }}>
          Loading more products...
        </div>
      )}
    </div>
  );
};

export default ProductList;