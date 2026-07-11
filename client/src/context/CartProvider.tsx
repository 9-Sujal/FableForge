import { useEffect, useState, type FC, type ReactNode } from "react";
import type { CartItemAPI, cartItem } from "../store/cart";
import {
  getCartState,
  updateCartId,
  updateCartItems,
  updateCartState,
} from "../store/cart";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../hooks/useAuth";
import client from "../api/client";
import toast from "react-hot-toast";
import { parseError } from "../utils/helper";
import { AxiosError } from "axios";
import { CartContext } from "./cart-context"; // ← import from separate file

interface CartApiResponse {
  cart: {
    id: string;
    items: CartItemAPI[];
  };
}

interface Props {
  children: ReactNode;
}

const CART_KEY = "cartItems";
const updateCartInLS = (cartItems: cartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
};

let startLSUpdate = false;

const CartProvider: FC<Props> = ({ children }) => {
  const cart = useSelector(getCartState);
  const dispatch = useDispatch();
  const { profile } = useAuth();
  const [pending, setPending] = useState(false);
  const [fetching, setFetching] = useState(true);

  

  const clearCart = () => {
    dispatch(updateCartState({ items: [], id: "" }));
    if (profile) {
      setPending(true);
      client
        .post("/cart/clear")
        .then(() => toast.success("Cart cleared successfully."))
        .catch(parseError)
        .finally(() => setPending(false));
    }
  };

  const updateCart = (item: cartItem) => {

    startLSUpdate = true;
    dispatch(updateCartItems(item));


   

    if (profile) {
      setPending(true);
      client
        .post("/cart", {
          items: [{ product: item.product.id, quantity: item.quantity }],
        })
        .then(({ data }) => {
          toast.success("Product added to cart.");
            

          dispatch(updateCartId(data.cart));
        })
        .catch(parseError)
        .finally(() => setPending(false));
    }
  };

  useEffect(() => {
    if (startLSUpdate && !profile) {
      updateCartInLS(cart.items);
    }
  }, [cart.items, profile]);

  useEffect(() => {
    const fetchCartInfo = async () => {
      if (!profile) {
        const result = localStorage.getItem(CART_KEY);
        if (result) {
          dispatch(updateCartState({ items: JSON.parse(result) }));
        }
        return setFetching(false);
      }
      try {
        const { data } = await client.get<CartApiResponse>("/cart");
        dispatch(updateCartState({ id: data.cart.id, items: data.cart.items }));
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) return;
          parseError(error);
        }
      } finally {
        setFetching(false);
      }
    };
    fetchCartInfo();
  }, [dispatch, profile]);

  return (
    <CartContext.Provider
      value={{
        id: cart.id,
        items: cart.items,
        totalCount: cart.totalCount,
        subTotal: cart.subTotal,
        totalPrice: cart.totalPrice,
        pending,
        fetching,
        updateCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;