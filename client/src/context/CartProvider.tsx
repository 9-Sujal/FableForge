// import { createContext, useState } from "react";


// export interface ICartContext {
//   id?: string;
//   items: cartItem[];
//   pending: boolean;
//   fetching: boolean;
//   totalCount: number;
//   totalPrice: number;
//   subTotal: number;
//   updateCart(item: cartItem): void;
//   clearCart(): void;
// }

// export const CartContext = createContext<ICartContext>({
//      items: [],
//      pending: false,
//      fetching: true,
//         totalCount: 0,
//         totalPrice: 0,
//         subTotal: 0,
//         updateCart() {},
//         clearCart() {},
// }); 

// const CART_KEY = "cartItems"; 

// const updateCartInLs = (cartItems: cartItem[]) => {
//     localStorage.setItem(CART_KEY, JSON.stringify(cartItems));

// }; 
// let startLsUpdate = false; 


// type CartProviderProps = {
//   children: React.ReactNode;
// };

// export function CartProvider({ children }: CartProviderProps) {
     
//     const cart = useSelector(getCartState); 
//     const dispatch = useDispatch();
//      const {profile} =  useAuth();  

//        const [pending,setPending] = useState(false);
//        const [fetching, setFetching] = useState(true);

//        const clearCart = ()=> {
//         //update cart in redux
//         dispatch(updateCartState({items:[], id:""})); 

//     //     if (profile) {
//     //   // update the server/database
//     //   // if user is authenticated sending api request
//     //   setPending(true);
//     //   client
//     //     .post("/cart/clear")
//     //     .then(() => {
//     //       toast.success("Cart cleared successfully.");
//     //     })
//     //     .catch(parseError)
//     //     .finally(() => {
//     //       setPending(false);
//     //     });
//     // }
//        };

//        //update cart

//        const updateCart = (item: cartItem) => {
//         startLSUpdate = true; 
//         dispatch(updateCartState({items:[...cart.items, item], id: cart.id}));
//           if (profile) {
//       // update the server/database
//       // if user is authenticated sending api request
//       setPending(true);
//       client
//         .post("/cart", {
//           items: [{ product: item.product.id, quantity: item.quantity }],
//         })
//         .then(({ data }) => {
//           toast.success("Product added to cart.");
//           dispatch(updateCartId(data.cart));
//         })
//         .catch(parseError)
//         .finally(() => {
//           setPending(false);
//         });
//     }
//        }; 

//       useEffect(() => {
//     const fetchCartInfo = async () => {
//       if (!profile) {
//         const result = localStorage.getItem(CART_KEY);
//         if (result) {
//           dispatch(updateCartState({ items: JSON.parse(result) }));
//         }

//         return setFetching(false);
//       }

//       try {
//         const { data } = await client.get<CartApiResponse>("/cart");
//         dispatch(updateCartState({ id: data.cart.id, items: data.cart.items }));
//       } catch (error) {
//         if (error instanceof AxiosError) {
//           if (error.response?.status === 404) return;
//           parseError(error);
//         }
//       } finally {
//         setFetching(false);
//       }
//     };

//     fetchCartInfo();
//   }, [dispatch, profile]);



//   return (
//     <CartContext.Provider value={{
//         id: cart.id,
//         items: cart.items,
//         totalCount: cart.totalCount,
//         totalPrice: cart.totalPrice,
//         subTotal: cart.subTotal,
//         pending,
//         fetching,
//         updateCart,
//         clearCart, 
//     }}>   
//     {children}
//     </CartContext.Provider>
    
//   );
// }