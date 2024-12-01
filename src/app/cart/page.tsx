"use client";

import { useCart } from "@/context/CartContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CartPage = () => {
    const { cart, fetchCart, clearCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        fetchCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto mt-10">
                <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
                <p>Your cart is currently empty.</p>
            </div>
        );
    }

    const handleCheckout = async () => {
        if (!cart.id) return;
        router.push(`/checkout/${cart.id}`);
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            <ul>
                {cart.items.map((item) => (
                    <li key={item.id} className="mb-4">
                        <div className="flex items-center">
                            <img
                                src={item.thumbnail || "/placeholder.png"}
                                alt={item.product_title || "Product"}
                                className="w-20 h-20 object-cover mr-4"
                            />
                            <div>
                                <p className="font-bold">{item.product_title || item.title}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${item.unit_price.toFixed(2)}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-4">
                <p className="text-lg font-bold">Total: ${cart.total.toFixed(2)}</p>
            </div>
            <div className="mt-4 flex gap-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleCheckout}
                >
                    Checkout
                </button>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={clearCart}
                >
                    Clear Cart
                </button>
            </div>
        </div>
    );
};

export default CartPage;
