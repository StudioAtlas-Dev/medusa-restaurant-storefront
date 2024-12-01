/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "9000", // Medusa backend port
                pathname: "/static/**", // Adjust the path if needed
            },
        ],
    },
};

export default nextConfig;
