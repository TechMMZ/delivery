/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const RelatedProducts = ({ products, currentCategory, currentProductId }) => {
    const { addItem } = useCart();
    const [showNotif, setShowNotif] = useState(false);

    const handleAddToCart = (product) => {
        addItem(product, 1);
        setShowNotif(true);

        setTimeout(() => {
            setShowNotif(false);
        }, 2000);
    };

    const relatedProducts = products.filter(
        p => p.categoria === currentCategory && p.id !== currentProductId
    );

    if (relatedProducts.length === 0) return null;

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                También podría interesarte:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedProducts.map((product, index) => (
                    <motion.div
                        key={`${product.id}-${index}`}
                        className="border rounded-xl overflow-hidden shadow flex flex-col bg-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <Link to={`/products/${product.categoria}/${product.id}`} className="block flex-grow">
                            <img
                                src={product.imgurl}
                                alt={product.nombre}
                                className="h-40 w-full max-w-xs object-contain mx-auto mt-4"
                                style={{ maxHeight: '160px' }}
                            />
                            <div className="p-3">
                                <h4 className="text-gray-800 font-medium">{product.nombre}</h4>
                                <p className="text-indigo-600 font-semibold">S/ {product.precio}</p>
                            </div>
                        </Link>
                        <div className="p-3 pt-0 space-y-2">
                            <Link
                                to={`/products/${product.categoria}/${product.id}`}
                                className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
                            >
                                Ver detalles
                            </Link>
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="w-full text-center bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold transition"
                            >
                                Añadir al carrito
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

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
        </div>
    );
};

export default RelatedProducts;
