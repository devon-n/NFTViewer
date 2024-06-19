"use client";

import Image from 'next/image';

const Card = ({ nft }) => {
    const { cachedUrl, metadata } = nft;
    const { name, description, attributes } = metadata.metadata;

    return (
        <div className="border p-4 rounded shadow-lg bg-gradient-to-r from-purple-800 via-pink-500 to-red-500 transform hover:scale-105 transition-transform duration-300">
            <div className="relative">
                {cachedUrl ? (
                    <Image src={cachedUrl} alt={name} width={300} height={300} className="rounded-lg shadow-neon" />
                ) : (
                    <div className="w-[300px] h-[300px] bg-gray-800 flex items-center justify-center rounded-lg shadow-neon">
                        <span className="text-gray-400">No Image Available</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-purple-900 opacity-50 rounded-lg pointer-events-none"></div>
            </div>
            <h3 className="text-2xl font-bold mt-4 text-neon-pink">{name}</h3>
            <p className="text-md mt-2 text-neon-blue">{description}</p>
            <div className="mt-4 space-y-2">
                {attributes.map((attr, index) => (
                    <div key={index} className="text-md text-neon-green">
                        <strong>{attr.trait_type}:</strong> {attr.value}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Card;
