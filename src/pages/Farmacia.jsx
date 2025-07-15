import React, { useState, useMemo, useEffect } from 'react';
import useFarmacia from '../services/useFarmacia';
import ProductGrid from '../components/product/ProductGrid';
import SkeletonGrid from '../components/product/SkeletonGrid';

const Farmacia = () => {
    const { farmacia, loading, error } = useFarmacia();
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    // Skeleton al cargar datos
    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => setShowSkeleton(false), 500);
            return () => clearTimeout(timer);
        } else {
            setShowSkeleton(true);
        }
    }, [loading]);

    const categories = useMemo(
        () => ['Todos', ...new Set(farmacia.map(p => p.categoria))],
        [farmacia]
    );

    // Skeleton al cambiar de categoría
    useEffect(() => {
        if (!loading) {
            setShowSkeleton(true);
            const timer = setTimeout(() => setShowSkeleton(false), 500);
            return () => clearTimeout(timer);
        }
    }, [selectedCategory, loading]);

    const filteredProducts = useMemo(
        () => farmacia.filter(p => p.nombre && p.precio && p.imgurl),
        [farmacia]
    );

    const filteredByCategory = useMemo(
        () => selectedCategory === 'Todos'
            ? filteredProducts
            : filteredProducts.filter(p => p.categoria === selectedCategory),
        [selectedCategory, filteredProducts]
    );

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Categorías */}
            <div role="tablist" className="flex flex-wrap justify-center gap-4 mb-8">
                {categories.map(category => (
                    <button
                        key={category}
                        role="tab"
                        aria-selected={selectedCategory === category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-2 rounded-full border text-lg font-medium transition-transform duration-150
              ${selectedCategory === category
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-700'}
              active:scale-95`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Skeleton o productos */}
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {showSkeleton
                ? <SkeletonGrid />
                : <ProductGrid products={filteredByCategory} />
            }
        </div>
    );
};

export default Farmacia;
