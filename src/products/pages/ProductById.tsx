import { useParams } from "react-router-dom"
import { useProduct } from "../hooks/useProduct"
import { ProductCard } from "../components/ProductCard"
import { useEffect } from "react"


export const ProductById = () => {

  const {id} = useParams()

  const { product, isLoading } = useProduct({id: Number(id) ?? 0})

  useEffect(() => {
    window.scrollTo(0, 0)
  })

  return (
    <div className="flex-col">
      <h1 className="text-2xl font-bold">Producto: {`${id}`}</h1>

      { isLoading && <p>Cargando...</p> }

      { product && <ProductCard product={product} fullDescription/>}
  </div>
  )
}
