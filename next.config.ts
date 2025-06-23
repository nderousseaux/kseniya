import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	experimental: {
		ppr: false, // Assure-toi que le Partial Prerendering est désactivé
	},
	// Force le streaming pour Safari
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Accel-Buffering',
						value: 'no',
					},
					{
						key: 'Cache-Control',
						value: 'no-cache, no-store, must-revalidate',
					},
				],
			},
		];
	},
};

export default nextConfig;
