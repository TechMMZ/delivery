/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart as clearCartStorage,
} from '../services/useCart';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        const savedCart = getCart();
        setCartItems(savedCart);
    }, []);

    const addItem = (product, quantity = 1) => {
        const updatedCart = addToCart(product, quantity);
        setCartItems(updatedCart);
    };

    const removeItem = (productKey) => {
        const updatedCart = removeFromCart(productKey);
        setCartItems(updatedCart);
    };

    const updateItemQuantity = (productKey, cantidad) => {
        const updatedCart = updateQuantity(productKey, cantidad);
        setCartItems(updatedCart);
    };

    const clearCart = () => {
        clearCartStorage();
        setCartItems([]);
    };

    const subtotal = useMemo(() => cartItems.reduce((total, item) => total + (item.precio * (item.cantidad || 1)), 0), [cartItems]);
    const totalItems = useMemo(() => cartItems.reduce((total, item) => total + (item.cantidad || 1), 0), [cartItems]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addItem,
                removeItem,
                updateItemQuantity,
                clearCart,
                getTotalItems: () => totalItems,
                getSubtotal: () => subtotal,
                getTotalPrice: () => subtotal + deliveryFee - discount,
                getItemCount: () => cartItems.length,
                deliveryFee,
                discount,
                setDeliveryFee,
                setDiscount
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
