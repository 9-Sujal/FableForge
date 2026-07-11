import { createContext } from "react";
import type { cartItem } from "../store/cart";

export interface ICartContext {
  id?: string;
  items: cartItem[];
  pending: boolean;
  fetching: boolean;
  totalCount: number;
  totalPrice: number;
  subTotal: number;
  updateCart(item: cartItem): void;
  clearCart(): void;
}

export const CartContext = createContext<ICartContext>({
  items: [],
  pending: false,
  fetching: true,
  totalCount: 0,
  totalPrice: 0,
  subTotal: 0,
  updateCart() {},
  clearCart() {},
});