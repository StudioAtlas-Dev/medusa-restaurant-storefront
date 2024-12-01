"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { medusaClient } from "@/lib/medusa"; // Ensure this points to your Medusa client configuration
import { Cart as MedusaCart } from "@medusajs/medusa";

type CartContextType = {
    cart: MedusaCart | null;
    setCart: React.Dispatch<React.SetStateAction<MedusaCart | null>>;
    fetchCart: () => Promise<void>;
    clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<MedusaCart | null>(null);

    const initializeCart = async () => {
        const storedCartId = localStorage.getItem("cart_id");
        if (storedCartId) {
            try {
                const { cart: existingCart } = await medusaClient.carts.retrieve(storedCartId);
                setCart(existingCart);
                return;
            } catch (error) {
                console.error("Error retrieving cart:", error);
                localStorage.removeItem("cart_id");
            }
        }

        try {
            const { cart: newCart } = await medusaClient.carts.create({
                region_id: "reg_01JD3KMQAR3FGDPEWQKWS235ZD", // Replace with your actual region ID
            });
            setCart(newCart);
            localStorage.setItem("cart_id", newCart.id);
            console.log("New cart created:", newCart);
        } catch (error) {
            console.error("Error creating cart:", error);
        }
    };

    const fetchCart = async () => {
        const cartId = localStorage.getItem("cart_id");
        if (!cartId) {
            await initializeCart();
            return;
        }
        console.log()
        try {
            // Use the `query` property to pass query parameters
            const { cart: fetchedCart } = await medusaClient.carts.retrieve(cartId, {
                query: { expand: "items.variant.product" },
            });
            setCart(fetchedCart);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };


    const clearCart = async () => {
        const cartId = localStorage.getItem("cart_id");
        if (!cartId) return;

        try {
            await medusaClient.carts.delete(cartId);
            localStorage.removeItem("cart_id");
            setCart(null);
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    useEffect(() => {
        initializeCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, setCart, fetchCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
