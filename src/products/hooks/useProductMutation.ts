import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type Product, productActions } from ".."

export const useProductMutation = () => {

  const queryClient = useQueryClient()

  const productMutation = useMutation({
    mutationFn: productActions.createProduct,
    onMutate: (product) => {
      console.log('mutando - optimistic update')

      //Optimistic product
      const optimisticProduct = { id: Math.random(), ...product };

      //Almacenamos el producto en el cache del query client
      queryClient.setQueryData<Product[]>(
        ['products', { filterkey: product.category }],
        (oldData) => {
          if (!oldData) return [optimisticProduct] as Product[];

          return [...oldData, optimisticProduct] as Product[];
        }
      );

      return {
        optimisticProduct
      };
    },
    //data es la respuesta de la petición, variables es el objeto original que mandamos en el post y el context es la información que regresa el onMutate
    onSuccess: (data, variables, context) => {

      console.log({ data, variables, context })

      // esto es para que se actualice la lista de productos con el nuevo producto
      // queryClient.invalidateQueries({
      //   queryKey: ['products', { filterkey: data.category}]
      // })

      //se elimina el producto optimista de la lista de productos
      queryClient.removeQueries({
        queryKey: ['products', context?.optimisticProduct.id]
      });

      queryClient.setQueryData<Product[]>(
        ['products', { filterkey: data.category}],
        (oldData) => {
          if(!oldData) return [data] as Product[]
          //esto se encarga de validar si el producto que se acaba de crear es el mismo que el que se creó de manera optimista
          return oldData.map( cacheProduct => {
            return cacheProduct.id === context?.optimisticProduct.id ? data : cacheProduct
          }) as Product[]
        }
      )
    },
    // onSettled: () => {
    //   console.log('producto creado')
    // },

    onError: (error, variables, context) => {
      console.error(error)
      //se elimina el producto optimista de la lista de productos
      queryClient.removeQueries({
        queryKey: ['products', context?.optimisticProduct.id]
      });


      queryClient.setQueryData<Product[]>(
        ['products', { filterkey: variables.category}],
        (oldData) => {
          if(!oldData) return []
          //esto se encarga de eliminar el producto que se creó de manera optimista
          return oldData.filter( cacheProduct =>  cacheProduct.id !== context?.optimisticProduct.id ) as Product[]
        }
      )
    }
  })

  return productMutation
}
