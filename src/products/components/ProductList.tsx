import { FC } from "react"
import { type Product, ProductCard, usePrefetchProduct } from ".."

interface ProductListProps {
  products: Product[]
}

export const ProductList:FC<ProductListProps> = ({products}) => {

  const prefetchProduct = usePrefetchProduct()

  return (
    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 justify-center max-w-max">
      {
        products.map((product) => (
          <ProductCard key={product.id} product={product} prefetchProduct={prefetchProduct} />
        ))
      }
    </div>
  )
}