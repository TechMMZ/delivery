import React from 'react';

const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <div className="bg-gray-300 h-32 w-32 rounded mb-4" />
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
);

const SkeletonGrid = ({ count = 8 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
            <SkeletonCard key={idx} />
        ))}
    </div>
);

export default SkeletonGrid;