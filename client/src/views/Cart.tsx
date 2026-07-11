import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import { useState } from "react";
import client from "../api/client";
import { calculateDiscount, formatPrice, parseError } from "../utils/helper";
import Skeletons from "../components/Skeletons";
import { Button, Chip, Divider } from "@heroui/react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";

export default function Cart() {
   const { profile } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const {
    id,
    pending,
    items,
    totalCount,
    fetching,
    subTotal,
    totalPrice,
    updateCart,
    clearCart,
  } = useCart();



  const handleCheckout = async () => {
    try {
      if (!profile) return navigate("/sign-up");
      setBusy(true);
      const { data } = await client.post("/checkout", { cartId: id });
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       const  razorpay= new (window as any).Razorpay ({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency, 
        order_id: data.orderId,
        name:"Ebook store",
        description: "purchase book",
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         handler: async function (response: any) {
        try {
          await client.post("/checkout/verify", {
            dbOrderId: data.dbOrderId,
razorpay_order_id: response.razorpay_order_id,
razorpay_payment_id: response.razorpay_payment_id,
 razorpay_signature: response.razorpay_signature,
          });

          navigate("/payment-success", {
            state: {
              orderId: data.dbOrderId,
            },
          });
        } catch (err) {
          parseError(err);
        }
      },
        prefill:{email: profile?.email},
        theme:{ color: "#dc2626"},
       })
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       razorpay.on("payment.failed", (response: any) => {
  parseError(
    new Error(response.error.description || "Payment failed")
  );
});

razorpay.open()
    } catch (error) {
      parseError(error);
    } finally {
      setBusy(false);
    }
  };

  if (fetching) return <Skeletons.Cart />;

  if (!totalCount)
    return (
      <div className="lg:p-0 p-5">
        <h1 className="text-xl mb-6 font-semibold">Your Shopping Cart</h1>
        <div className="p-5 text-center">
          <h1 className="font-semibold text-3xl opacity-40">
            This Cart is Empty!
          </h1>
        </div>
      </div>
    );

  return (
    <div className="lg:p-0 p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl mb-6 font-semibold">Your Shopping Cart</h1>
        <button onClick={clearCart} className="underline">
          Clear Cart
        </button>
      </div>
      <div className="space-y-6">
        {items.map(({ product, quantity }) => {
          return (
            <div key={product.id} className="flex">
              {/* Product Image */}

              <img
                src={product.cover}
                alt={product.title}
                className="w-28 h-46.25 object-cover rounded"
              />

              {/* Product Details */}
              <div className="md:grid flex flex-col grid-cols-6">
                <div className="p-5 col-span-5">
                  <h1>{product.title}</h1>

                  <div className="flex space-x-2">
                    <Chip color="danger">
                      {calculateDiscount(product.price)}% Off
                    </Chip>
                    <h1 className="line-through italic">
                      {formatPrice(Number(product.price.mrp))}
                    </h1>
                  </div>

                  <div className="flex space-x-2">
                    <h1 className="font-bold">
                      {formatPrice(Number(product.price.sale))}
                    </h1>

                    <span>x {quantity}</span>
                  </div>
                </div>

                {/* Cart Control */}
                <div className="col-span-1 flex items-center space-x-3 p-5 md:p-0">
                  <Button
                    isIconOnly
                    variant="solid"
                    size="sm"
                    isLoading={pending || busy}
                    onPress={() => updateCart({ product, quantity: -1 })}
                  >
                    <FaMinus />
                  </Button>
                  <Chip radius="sm" variant="bordered">
                    {quantity}
                  </Chip>
                  <Button
                    isIconOnly
                    variant="solid"
                    size="sm"
                    isLoading={pending || busy}
                    onPress={() => updateCart({ product, quantity: 1 })}
                  >
                    <FaPlus />
                  </Button>
                  <Button
                    isIconOnly
                    variant="solid"
                    size="sm"
                    isLoading={pending || busy}
                    onPress={() => updateCart({ product, quantity: -quantity })}
                  >
                    <FaRegTrashCan />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Divider className="my-6" />

      <div className="md:block flex justify-between items-end">
        <div className="text-right space-y-1">
          <h1 className="font-semibold text-xl">Cart Total</h1>
          <Divider />
          <p className="line-through italic">{formatPrice(subTotal)}</p>
          <p className="font-semibold text-xl">{formatPrice(totalPrice)}</p>
        </div>

        <div className="text-right md:mt-3">
          <Button
            color="danger"
            radius="sm"
            size="lg"
            isLoading={pending || busy}
            startContent={<MdOutlineShoppingCartCheckout size={18} />}
            onPress={handleCheckout}
          >
            Checkout
          </Button>
          <div className="mt-3">
            <Chip size="sm">
              <p>
                You are saving total{" "}
                {calculateDiscount({
                  mrp: subTotal.toFixed(2),
                  sale: totalPrice.toFixed(2),
                })}
                %
              </p>
            </Chip>
          </div>
        </div>
      </div>
    </div>
  );
};

