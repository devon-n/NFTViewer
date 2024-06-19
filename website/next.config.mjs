/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'nft-cdn.alchemy.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'ipfs.io',
                port: '',
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;
