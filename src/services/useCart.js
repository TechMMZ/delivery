// useCart.js
const CART_KEY = 'shopping_cart';

export const getCart = () => {
    try {
        const savedCart = localStorage.getItem(CART_KEY);
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        return [];
    }
};

export const saveCart = (cartItems) => {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
        return cartItems;
    } catch (error) {
        console.error('Error al guardar el carrito:', error);
        return cartItems;
    }
};

// Utilidad para validar cantidad
const isValidQuantity = (cantidad) => Number.isInteger(cantidad) && cantidad > 0;

// En addToCart y updateQuantity, valida la cantidad
export const addToCart = (product, quantity = 1) => {
    if (!isValidQuantity(quantity)) return getCart();
    const currentCart = getCart();
    const productKey = `${product.categoria}-${product.id}`;
    const existingItemIndex = currentCart.findIndex(item => item.key === productKey);

    if (existingItemIndex > -1) {
        currentCart[existingItemIndex].cantidad = (currentCart[existingItemIndex].cantidad ?? 0) + quantity;
    } else {
        currentCart.push({
            ...product,
            key: productKey, // ✅ importante
            cantidad: quantity
        });
    }

    return saveCart(currentCart);
};

export const removeFromCart = (productKey) => {
    const currentCart = getCart();
    const updatedCart = currentCart.filter(item => item.key !== productKey);
    return saveCart(updatedCart);
};

export const updateQuantity = (productKey, newQuantity) => {
    if (!isValidQuantity(newQuantity)) return removeFromCart(productKey);
    const currentCart = getCart();

    if (newQuantity <= 0) {
        return removeFromCart(productKey);
    }

    const updatedCart = currentCart.map(item =>
        item.key === productKey
            ? { ...item, cantidad: newQuantity }
            : item
    );

    return saveCart(updatedCart);
};

export const clearCart = () => {
    try {
        localStorage.removeItem(CART_KEY);
        return [];
    } catch (error) {
        console.error('Error al limpiar el carrito:', error);
        return [];
    }
};
