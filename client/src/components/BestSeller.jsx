import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
  const { products } = useAppContext();
  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Some Products</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-2 mt-6 justify-items-center'>
        {products.filter((product) => product.inStock).slice(0, 4).map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}

      </div>
    </div>
  )
}

export default BestSeller
