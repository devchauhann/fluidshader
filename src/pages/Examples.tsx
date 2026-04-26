/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';

const Icon = ({ icon, class: className }: { icon: string; class?: string }) => {
    // @ts-ignore
    return <iconify-icon icon={icon} class={className} />;
};

interface Example {
    id: string;
    name: string;
    description: string;
    colors: {
        cyan: [number, number, number];
        yellow: [number, number, number];
        orange: [number, number, number];
        purple: [number, number, number];
        blue: [number, number, number];
    };
    speed: number;
    warp: number;
    noise: number;
    grain: number;
    tags: string[];
}

export default function Examples() {
    const [selectedExample, setSelectedExample] = useState<Example | null>(null);

    const examples: Example[] = [
        {
            id: 'default-smooth',
            name: 'Smooth & Calm',
            description: 'The default shader with smooth, slow animations. Perfect for subtle backgrounds.',
            colors: {
                cyan: [0.05, 0.80, 0.85],
                yellow: [0.95, 0.90, 0.40],
                orange: [0.90, 0.35, 0.10],
                purple: [0.55, 0.10, 0.80],
                blue: [0.10, 0.25, 0.90],
            },
            speed: 0.08,
            warp: 0.15,
            noise: 1.8,
            grain: 0.02,
            tags: ['smooth', 'calm', 'default'],
        },
        {
            id: 'default-energetic',
            name: 'Energetic & Dynamic',
            description: 'Same colors with faster flow and more warp for an energetic feel.',
            colors: {
                cyan: [0.05, 0.80, 0.85],
                yellow: [0.95, 0.90, 0.40],
                orange: [0.90, 0.35, 0.10],
                purple: [0.55, 0.10, 0.80],
                blue: [0.10, 0.25, 0.90],
            },
            speed: 0.25,
            warp: 0.50,
            noise: 1.0,
            grain: 0.04,
            tags: ['energetic', 'fast', 'dynamic'],
        },
        {
            id: 'default-grainy',
            name: 'Film Grain & Vintage',
            description: 'Same colors with strong film grain for a vintage film aesthetic.',
            colors: {
                cyan: [0.05, 0.80, 0.85],
                yellow: [0.95, 0.90, 0.40],
                orange: [0.90, 0.35, 0.10],
                purple: [0.55, 0.10, 0.80],
                blue: [0.10, 0.25, 0.90],
            },
            speed: 0.10,
            warp: 0.20,
            noise: 2.0,
            grain: 0.12,
            tags: ['vintage', 'grain', 'film'],
        },
        {
            id: 'default-complex',
            name: 'Complex & Detailed',
            description: 'Same colors with high noise scale for complex, detailed patterns.',
            colors: {
                cyan: [0.05, 0.80, 0.85],
                yellow: [0.95, 0.90, 0.40],
                orange: [0.90, 0.35, 0.10],
                purple: [0.55, 0.10, 0.80],
                blue: [0.10, 0.25, 0.90],
            },
            speed: 0.12,
            warp: 0.25,
            noise: 3.5,
            grain: 0.03,
            tags: ['complex', 'detailed', 'noise'],
        },
        {
            id: 'default-extreme-warp',
            name: 'Extreme Warp',
            description: 'Same colors with maximum warp for dramatic distortion effects.',
            colors: {
                cyan: [0.05, 0.80, 0.85],
                yellow: [0.95, 0.90, 0.40],
                orange: [0.90, 0.35, 0.10],
                purple: [0.55, 0.10, 0.80],
                blue: [0.10, 0.25, 0.90],
            },
            speed: 0.15,
            warp: 0.58,
            noise: 1.2,
            grain: 0.05,
            tags: ['extreme', 'warp', 'dramatic'],
        },
        {
            id: 'default-minimal',
            name: 'Minimal & Clean',
            description: 'Same colors with minimal effects for a clean, simple look.',
            colors: {
                cyan: [0.05, 0.80, 0.85],
                yellow: [0.95, 0.90, 0.40],
                orange: [0.90, 0.35, 0.10],
                purple: [0.55, 0.10, 0.80],
                blue: [0.10, 0.25, 0.90],
            },
            speed: 0.06,
            warp: 0.05,
            noise: 0.8,
            grain: 0.01,
            tags: ['minimal', 'clean', 'simple'],
        },
        {
            id: 'default-fast-minimal',
            name: 'Fast & Minimal',
            description: 'Same colors with fast speed but minimal warp for quick, clean animations.',
            colors: {
                cyan: [0.05, 0.80, 0.85],
                yellow: [0.95, 0.90, 0.40],
                orange: [0.90, 0.35, 0.10],
                purple: [0.55, 0.10, 0.80],
                blue: [0.10, 0.25, 0.90],
            },
            speed: 0.30,
            warp: 0.08,
            noise: 1.0,
            grain: 0.02,
            tags: ['fast', 'minimal', 'clean'],
        },
        {
            id: 'default-artistic',
            name: 'Artistic & Subtle',
            description: 'Same colors with balanced parameters for an artistic, refined look.',
            colors: {
                cyan: [0.05, 0.80, 0.85],
                yellow: [0.95, 0.90, 0.40],
                orange: [0.90, 0.35, 0.10],
                purple: [0.55, 0.10, 0.80],
                blue: [0.10, 0.25, 0.90],
            },
            speed: 0.11,
            warp: 0.22,
            noise: 1.3,
            grain: 0.035,
            tags: ['artistic', 'subtle', 'refined'],
        },
    ];

    const copyExample = (example: Example) => {
        const code = `// ShaderStudio Export - ${example.name}
// Copy these parameters to recreate this effect

const params = {
  colors: {
    cyan: [${example.colors.cyan.join(', ')}],
    yellow: [${example.colors.yellow.join(', ')}],
    orange: [${example.colors.orange.join(', ')}],
    purple: [${example.colors.purple.join(', ')}],
    blue: [${example.colors.blue.join(', ')}],
  },
  speed: ${example.speed},
  warp: ${example.warp},
  noise: ${example.noise},
  grain: ${example.grain},
};`;

        navigator.clipboard.writeText(code).then(() => {
            alert('Parameters copied to clipboard!');
        });
    };

    return (
        <div className="w-full bg-gradient-to-br from-black via-[#0a0a0a] to-black">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-md"
            >
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <Icon icon="solar:layers-minimalistic-linear" class="text-xl text-white" />
                        </div>
                        <span className="font-medium text-lg tracking-tight hidden sm:inline-block">ShaderStudio</span>
                    </a>
                    <nav className="flex items-center gap-8">
                        <a href="/examples" className="text-sm font-light text-emerald-400">Examples</a>
                        <a href="/" className="btn-primary px-5 py-2">
                            <Icon icon="solar:layers-minimalistic-linear" class="text-lg" />
                            Back to Editor
                        </a>
                    </nav>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="w-full max-w-7xl mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6 leading-[1.1]">
                        Shader Examples
                    </h1>
                    <p className="text-lg text-white/60 mb-12 max-w-2xl">
                        Explore our curated collection of beautiful shader presets. Click any example to see its parameters and copy them to your projects.
                    </p>
                </motion.div>

                {/* Examples Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {examples.map((example, idx) => (
                        <motion.div
                            key={example.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className="group cursor-pointer"
                            onClick={() => setSelectedExample(example)}
                        >
                            <div className="relative h-64 rounded-2xl overflow-hidden mb-4 border border-white/5 group-hover:border-white/20 transition-all">
                                {/* Placeholder with gradient using all colors */}
                                <div
                                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    style={{
                                        background: `linear-gradient(135deg, 
                      rgb(${Math.round(example.colors.cyan[0] * 255)}, ${Math.round(example.colors.cyan[1] * 255)}, ${Math.round(example.colors.cyan[2] * 255)}) 0%,
                      rgb(${Math.round(example.colors.yellow[0] * 255)}, ${Math.round(example.colors.yellow[1] * 255)}, ${Math.round(example.colors.yellow[2] * 255)}) 25%,
                      rgb(${Math.round(example.colors.orange[0] * 255)}, ${Math.round(example.colors.orange[1] * 255)}, ${Math.round(example.colors.orange[2] * 255)}) 50%,
                      rgb(${Math.round(example.colors.purple[0] * 255)}, ${Math.round(example.colors.purple[1] * 255)}, ${Math.round(example.colors.purple[2] * 255)}) 75%,
                      rgb(${Math.round(example.colors.blue[0] * 255)}, ${Math.round(example.colors.blue[1] * 255)}, ${Math.round(example.colors.blue[2] * 255)}) 100%
                    )`,
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-xl font-medium group-hover:text-emerald-400 transition-colors">
                                        {example.name}
                                    </h3>
                                    <p className="text-sm text-white/60 mt-1 line-clamp-2">
                                        {example.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {example.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        copyExample(example);
                                    }}
                                    className="w-full mt-4 py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-white/70 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <Icon icon="solar:copy-linear" class="text-base" />
                                    Copy Parameters
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Detail Modal */}
                {selectedExample && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedExample(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-black border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 glass"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-medium">{selectedExample.name}</h2>
                                <button
                                    onClick={() => setSelectedExample(null)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                                >
                                    <Icon icon="solar:close-square-linear" class="text-2xl" />
                                </button>
                            </div>

                            <p className="text-white/60 mb-8">{selectedExample.description}</p>

                            {/* Color Palette */}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                    <Icon icon="solar:palette-linear" class="text-xl" />
                                    Color Palette
                                </h3>
                                <div className="grid grid-cols-5 gap-4">
                                    {Object.entries(selectedExample.colors).map(([name, rgb]) => (
                                        <div key={name} className="text-center">
                                            <div
                                                className="w-full h-20 rounded-lg mb-2 border border-white/10"
                                                style={{
                                                    backgroundColor: `rgb(${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(rgb[2] * 255)})`,
                                                }}
                                            />
                                            <p className="text-xs font-medium capitalize">{name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Parameters */}
                            <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10">
                                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                    <Icon icon="solar:settings-linear" class="text-xl" />
                                    Parameters
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-white/60 mb-1">Flow Speed</p>
                                        <p className="text-xl font-mono font-medium">{selectedExample.speed.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/60 mb-1">Warp Bloom</p>
                                        <p className="text-xl font-mono font-medium">{selectedExample.warp.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/60 mb-1">Noise Scale</p>
                                        <p className="text-xl font-mono font-medium">{selectedExample.noise.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/60 mb-1">Grain Film</p>
                                        <p className="text-xl font-mono font-medium">{selectedExample.grain.toFixed(3)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedExample.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-4 py-2 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/30"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => copyExample(selectedExample)}
                                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                                >
                                    <Icon icon="solar:copy-linear" class="text-lg" />
                                    Copy Parameters
                                </button>
                                <a
                                    href="/"
                                    onClick={() => setSelectedExample(null)}
                                    className="flex-1 btn-ghost py-3 flex items-center justify-center gap-2"
                                >
                                    <Icon icon="solar:rocket-linear" class="text-lg" />
                                    Use in Editor
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="p-8 glass rounded-2xl text-center"
                >
                    <h3 className="text-2xl font-medium mb-4">Create Your Own</h3>
                    <p className="text-white/60 mb-8 max-w-lg mx-auto">
                        Inspired by these examples? Use the editor to customize and create your unique shaders.
                    </p>
                    <a href="/" className="btn-primary px-8 py-4 inline-flex items-center gap-2">
                        <Icon icon="solar:rocket-linear" class="text-lg" />
                        Open Editor
                    </a>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 px-6 mt-20">
                <div className="max-w-7xl mx-auto text-center text-sm text-white/40">
                    <p>© 2026 ShaderStudio. Created with WebGL & React.</p>
                </div>
            </footer>
        </div>
    );
}
