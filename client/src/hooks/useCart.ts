import { useContext } from "react";
import { CartContext } from "../context/cart-context";

const useCart = () => useContext(CartContext);

export default useCart;
