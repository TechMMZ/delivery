import React, { Fragment, useEffect, useContext } from 'react';
import { ChevronLeft, Trash2, Plus, Minus, X, ShoppingBag } from 'react-feather';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const {
        cartItems,
        removeItem,
        updateItemQuantity,
        clearCart,
        getSubtotal,
        getTotalItems,
    } = useCart();

    const { user } = useContext(AuthContext);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const finalizarCompra = () => {
        if (!user) {
            if (window.confirm('Debes iniciar sesión para continuar con la compra. ¿Deseas ir a iniciar sesión ahora?')) {
                onClose();
                navigate('/login');
            }
            return;
        }
        onClose();
        navigate('/checkout');
    };

    const detenerPropagacion = (e) => e.stopPropagation();

    // Utilidad para formatear precios
    const formatPrice = (value) => value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });

    return (
        <Fragment>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-full md:w-96 max-w-full bg-white shadow-xl z-50 transform transition-all duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    } flex flex-col`}
                role="dialog"
                aria-labelledby="cart-heading"
                onClick={detenerPropagacion}
            >
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Cerrar carrito">
                            <ChevronLeft size={20} className="text-gray-500" />
                        </button>
                        <h2 id="cart-heading" className="text-lg font-medium text-gray-900 flex items-center">
                            Tu carrito
                            {getTotalItems() > 0 && (
                                <span className="ml-2 text-sm text-gray-500">
                                    ({getTotalItems()} {getTotalItems() === 1 ? 'artículo' : 'artículos'})
                                </span>
                            )}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Cerrar carrito">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <ShoppingBag size={28} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Tu carrito está vacío</h3>
                        <p className="text-sm text-gray-500 max-w-xs">Parece que no has agregado ningún producto todavía.</p>
                        <button onClick={onClose} className="mt-6 px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                            Continuar comprando
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        <ul className="divide-y divide-gray-200">
                            {cartItems.map(({ key, nombre, cantidad, precio, imgurl }) => (
                                <li key={key} className="px-4 sm:px-6 py-5">
                                    <div className="flex gap-4">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                                            <img
                                                src={imgurl}
                                                alt={nombre}
                                                onError={(e) => { e.target.src = '/fallback.png'; }}
                                                className="h-full w-full object-contain object-center p-1"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3 className="line-clamp-2 text-sm">{nombre}</h3>
                                            </div>
                                            <div className="flex items-end justify-between text-sm mt-auto pt-2">
                                                <div className="flex items-center">
                                                    <button
                                                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                                                        onClick={() => updateItemQuantity(key, cantidad - 1)}
                                                        disabled={cantidad <= 1}
                                                        aria-label="Reducir cantidad"
                                                    >
                                                        <Minus size={14} className={cantidad <= 1 ? 'text-gray-300' : 'text-gray-500'} />
                                                    </button>
                                                    <span className="mx-3 w-5 text-center">{cantidad}</span>
                                                    <button
                                                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                                                        onClick={() => updateItemQuantity(key, cantidad + 1)}
                                                        aria-label="Aumentar cantidad"
                                                    >
                                                        <Plus size={14} className="text-gray-500" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center">
                                                    <p className="font-medium">{formatPrice(precio * cantidad)}</p>
                                                    <button
                                                        type="button"
                                                        className="ml-4 p-1 text-gray-400 hover:text-gray-500"
                                                        onClick={() => removeItem(key)}
                                                        aria-label={`Eliminar ${nombre} del carrito`}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-200 px-4 sm:px-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <p>Subtotal</p>
                                    <p>{formatPrice(getSubtotal())}</p>
                                </div>
                                <div className="border-t border-gray-200 pt-2 flex justify-between font-medium text-gray-900">
                                    <p>Total estimado</p>
                                    <p>{formatPrice(getSubtotal())}</p>
                                </div>
                            </div>
                        </div>

                        {/* Si no hay sesión, muestra aviso */}
                        {!user && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-sm text-red-600 rounded-lg">
                                Debes iniciar sesión para finalizar tu compra.
                                <Link to="/login" className="font-medium underline ml-1">Iniciar sesión</Link>
                            </div>
                        )}

                        <div className="mt-5 space-y-3">
                            <button
                                onClick={finalizarCompra}
                                disabled={!user}
                                className={`w-full border border-transparent rounded-lg py-3 px-4 text-white transition ${user ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                CONTINUAR CON LA COMPRA
                            </button>

                            <button
                                onClick={onClose}
                                className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 hover:bg-gray-50"
                            >
                                SEGUIR COMPRANDO
                            </button>

                            <button
                                onClick={clearCart}
                                className="w-full text-center text-sm text-red-600 hover:underline"
                            >
                                Vaciar carrito
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default Cart;
