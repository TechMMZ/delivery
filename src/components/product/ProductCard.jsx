/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Info, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';  // usar el context

const ProductCard = ({ product }) => {
    const { addItem } = useCart();  // 👈 usa addItem del context
    const [showNotif, setShowNotif] = useState(false);

    const handleAddToCart = () => {
        addItem(product);
        setShowNotif(true);

        setTimeout(() => {
            setShowNotif(false);
        }, 2000);  // notificación visible 2s
    };

    return (
        <>
            <motion.div
                className="border rounded-2xl shadow-sm p-4 flex flex-col h-full bg-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <img
                    src={product.imgurl}
                    alt={product.nombre}
                    className="w-full max-w-[180px] h-[180px] object-contain rounded-xl mb-4 mx-auto bg-gray-50"
                    loading="lazy"
                />
                <h3 className="text-xl font-semibold mb-1 text-gray-800">{product.nombre}</h3>
                <p className="text-indigo-600 font-bold text-lg mb-3">S/ {product.precio}</p>

                <p className="text-gray-600 mb-4 line-clamp-3">{product.descripcion}</p>

                <div className="mt-auto flex flex-col gap-3">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 shadow"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={18} /> Agregar al carrito
                    </motion.button>
                    <Link
                        to={`/products/${product.categoria}/${product.id}`}
                        className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 shadow text-center"
                    >
                        <Info size={18} /> Ver detalles
                    </Link>
                </div>
            </motion.div>

            {/* Notificación */}
            <AnimatePresence>
                {showNotif && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
                    >
                        <CheckCircle className="text-green-300" size={22} />
                        ¡Agregado al carrito!
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductCard;
