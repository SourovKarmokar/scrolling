import React, { useEffect, useRef , useState } from 'react'

const productPerPage = 10 ;

const ProductList = () => {
    const [product , setProduct] = useState([])
    const [page , setPage] = useState(0)
    const [hasMore , setHasMore] = useState(true)
    const loaderRef = useRef(null)


    useEffect(() => { 
        const fetchProduct = async () => {
           const response = await fetch(`https://dummyjson.com/products?limit=${productPerPage}&skip=10`);
        }

        const onIntersection = (items) => {
            const loaderItem = items[0];

            if(loaderItem.isIntersecting && hasMore ) {
                fetchProduct()                
            }
        }

        const observer = new IntersectionObserver(onIntersection)

        if(observer && loaderRef.current ) {
            observer.observe(loaderRef.current)
        }

        //cleanup
        return () => {
            if (observer) observer.disconnect()
        }

    }, [])


  return (
    <div>
      <div>Product List</div>

      {/* product list will be loaded */}

      <div ref={loaderRef}>Loading more products...</div>
    </div>
  )
}

export default ProductList
