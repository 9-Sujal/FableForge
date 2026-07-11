import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import client from "../api/client";
import { formatPrice } from "../utils/helper";
import Skeletons from "../components/Skeletons";
import { Divider } from "@heroui/react";


interface OrderItem {
  id: string;
  cover?: string;
  price: string;
  qty: number;
  slug: string;
  title: string;
  totalPrice: string;
}

interface Order {
  orders: OrderItem[];
  totalAmount: string;
}


export default function Payment() {
const [busy, setBusy] = useState(true);
  const [order, setOrder] = useState<Order>();

  const location = useLocation(); 
  const orderId = location.state?.orderId; 

  useEffect(() => {
    if(!orderId) return; 

    const fetchOrderDetail = async () => {
      
        const { data } = await client.post("/order/success", { orderId });
        setOrder(data);
        setBusy(false)
      
    };

    fetchOrderDetail();
  }, [orderId]);

  if (busy) return <Skeletons.Payment />;

  return (
    <div className="lg:p-0 p-5">
      <h1 className="font-semibold text-2xl">
        Congrats Your Order is Successful.
      </h1>
      <div className="p-5 flex flex-col items-center">
        {order?.orders.map((item) => {
          return (
            <div key={item.id} className="w-96">
              <div className="flex">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-28 h-40 rounded object-cover"
                />

                <div className="p-3 flex-1">
                  <Link
                    className="line-clamp-1 font-bold text-lg underline"
                    to={`/book/${item.slug}`}
                  >
                    {item.title}
                  </Link>

                  <p>Price: {formatPrice(Number(item.price))}</p>
                  <p>Qty: {item.qty}</p>
                </div>
              </div>

              <Divider className="my-3" />
            </div>
          );
        })}

        <div className="w-96 flex items-center justify-between">
          <p className="font-bold">Total Amount:</p>
          <p className="font-bold">{formatPrice(Number(order?.totalAmount))}</p>
        </div>
      </div>
    </div>
  );
};

