/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShaderCanvas } from './components/ShaderCanvas';
import { buildFsSource } from './shaderUtils';

const Icon = ({ icon, class: className }: { icon: string; class?: string }) => {
    // @ts-ignore
    return <iconify-icon icon={icon} class={className} />;
};

const DEFAULTS = {
    colors: {
        cyan: [0.05, 0.80, 0.85] as [number, number, number],
        yellow: [0.95, 0.90, 0.40] as [number, number, number],
        orange: [0.90, 0.35, 0.10] as [number, number, number],
        purple: [0.55, 0.10, 0.80] as [number, number, number],
        blue: [0.10, 0.25, 0.90] as [number, number, number],
    },
    speed: 0.12,
    warp: 0.25,
    noise: 1.5,
    grain: 0.04,
};

const hexToRgb01 = (h: string): [number, number, number] => [
    parseInt(h.slice(1, 3), 16) / 255,
    parseInt(h.slice(3, 5), 16) / 255,
    parseInt(h.slice(5, 7), 16) / 255,
];

const rgb01ToHex = (a: [number, number, number]): string =>
    '#' + a.map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();

export default function App() {
    const [params, setParams] = useState(() => {
        const saved = localStorage.getItem('shader-studio-design');
        return saved ? JSON.parse(saved) : DEFAULTS;
    });
    const [isPanelOpen, setIsPanelOpen] = useState(window.innerWidth > 768);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleSaveDesign = useCallback(() => {
        localStorage.setItem('shader-studio-design', JSON.stringify(params));
        setToastMessage('Design saved locally');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
    }, [params]);

    const handleCopyCode = useCallback(() => {
        const fs = buildFsSource(params);
        const code = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fluid Gradient</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:100vw;height:100vh;overflow:hidden;background:#09090b}
canvas{position:absolute;inset:0;width:100%;height:100%}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
const c=document.getElementById('c'),gl=c.getContext('webgl');
const vs=\`attribute vec4 p;void main(){gl_Position=p;}\`;
const fs=\`${fs.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
function sh(t,src){const s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);return s;}
const prog=gl.createProgram();
gl.attachShader(prog,sh(gl.VERTEX_SHADER,vs));
gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,fs));
gl.linkProgram(prog);
const buf=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,buf);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([1,-1,-1,-1,1,1,-1,1]),gl.STATIC_DRAW);
const ap=gl.getAttribLocation(prog,'p');
const ur=gl.getUniformLocation(prog,'u_resolution');
const ut=gl.getUniformLocation(prog,'u_time');
const t0=Date.now();
function draw(){
  if(c.width!==c.clientWidth||c.height!==c.clientHeight){c.width=c.clientWidth;c.height=c.clientHeight;}
  gl.viewport(0,0,c.width,c.height);gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(ap);
  gl.uniform2f(ur,c.width,c.height);
  gl.uniform1f(ut,(Date.now()-t0)/1000);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  requestAnimationFrame(draw);
}
draw();
</script>
</body>
</html>`;
        navigator.clipboard.writeText(code).then(() => {
            setToastMessage('Shader code copied to clipboard');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
        });
    }, [params]);

    const resetParams = () => setParams(DEFAULTS);

    const updateColor = (key: keyof typeof DEFAULTS.colors, hex: string) => {
        setParams(prev => ({
            ...prev,
            colors: {
                ...prev.colors,
                [key]: hexToRgb01(hex),
            },
        }));
    };

    const updateSlider = (key: 'speed' | 'warp' | 'noise' | 'grain', val: number) => {
        setParams(prev => ({ ...prev, [key]: val }));
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col pointer-events-none">
            <ShaderCanvas {...params} />

            {/* Full Screen Dismissal UI */}
            <AnimatePresence>
                {isFullScreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] pointer-events-auto bg-transparent group"
                    >
                        <button
                            onClick={() => setIsFullScreen(false)}
                            className="fixed top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full glass flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 active:scale-95"
                        >
                            <Icon icon="solar:close-circle-linear" class="text-xl" />
                            <span className="text-sm font-medium">Close Preview</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Layout */}
            <div className="w-full h-full flex flex-col md:flex-row">
                {/* Left Content Area */}
                <div className="flex-1 flex flex-col pointer-events-none">
                    {/* Header */}
                    <AnimatePresence>
                        {!isFullScreen && (
                            <motion.header
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="w-full px-6 py-10 md:px-12 flex items-center justify-between pointer-events-auto"
                            >
                                <div className="flex items-center gap-2 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                        <Icon icon="solar:layers-minimalistic-linear" class="text-xl text-white" />
                                    </div>
                                    <span className="font-medium text-lg tracking-tight hidden sm:inline-block">ShaderStudio</span>
                                </div>

                                <nav className="hidden md:flex items-center gap-10">
                                    {['Gallery', 'Docs', 'Examples', 'Pricing'].map(item => (
                                        <a key={item} href="#" className="text-sm font-light text-white/50 hover:text-white transition-colors">
                                            {item}
                                        </a>
                                    ))}
                                </nav>

                                <div className="flex items-center gap-5">
                                    <div className="hidden sm:flex items-center gap-4">
                                        <button
                                            onClick={handleSaveDesign}
                                            className="btn-ghost px-5 py-2 group"
                                        >
                                            <Icon icon="solar:diskette-linear" class="text-lg group-hover:scale-110 transition-transform" />
                                            Save Design
                                        </button>
                                    </div>
                                    <button
                                        className="md:hidden w-10 h-10 rounded-full glass flex items-center justify-center"
                                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                                    >
                                        <Icon icon="solar:hamburger-menu-linear" class="text-xl text-white" />
                                    </button>
                                </div>
                            </motion.header>
                        )}
                    </AnimatePresence>

                    {/* Hero Section */}
                    <AnimatePresence>
                        {!isFullScreen && (
                            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pointer-events-auto pb-20">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="flex flex-col items-center max-w-4xl"
                                >
                                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass mb-8">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[11px] font-medium tracking-widest uppercase text-white/60">Live Shader Editor</span>
                                    </div>

                                    <h1 className="text-5xl md:text-8xl font-medium tracking-tight mb-8 leading-[1.05]">
                                        Craft your gradient,<br />
                                        <span className="text-white/40">own your palette</span>
                                    </h1>

                                    <p className="text-lg md:text-xl font-light text-white/60 mb-12 max-w-xl leading-relaxed">
                                        Tune colors, speed, and warp intensity live. Copy the generated WebGL shader and drop it directly into your project.
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center gap-4">
                                        <button
                                            onClick={handleCopyCode}
                                            className="btn-primary px-8 py-4 hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                                        >
                                            <Icon icon="solar:copy-linear" class="text-lg" />
                                            Copy shader code
                                        </button>
                                        <button
                                            onClick={() => setIsFullScreen(true)}
                                            className="btn-ghost px-8 py-4 hover:scale-105 active:scale-95"
                                        >
                                            <Icon icon="solar:maximize-linear" class="text-lg" />
                                            Full Preview
                                        </button>
                                    </div>
                                </motion.div>
                            </main>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Sidebar - Desktop Always Visible */}
                <AnimatePresence>
                    {!isFullScreen && (
                        <>
                            {/* Desktop Sidebar */}
                            <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="hidden md:flex w-[320px] h-screen overflow-y-auto glass rounded-l-3xl p-6 pointer-events-auto z-40 flex-col gap-8 shadow-2xl flex-shrink-0"
                            >
                                <div className="flex items-center gap-3">
                                    <Icon icon="solar:settings-linear" class="text-lg text-white/40" />
                                    <h2 className="font-medium text-sm">Shader Editor</h2>
                                </div>

                                <div className="space-y-6 flex-1 overflow-y-auto">
                                    <section>
                                        <h3 className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-4">Colors</h3>
                                        <div className="grid gap-4">
                                            {Object.entries(params.colors).map(([name, rgb]) => {
                                                const hex = rgb01ToHex(rgb as [number, number, number]);
                                                return (
                                                    <div key={name} className="flex items-center justify-between group">
                                                        <label className="flex items-center gap-4 cursor-pointer">
                                                            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/10">
                                                                <input
                                                                    type="color"
                                                                    value={hex}
                                                                    onChange={(e) => updateColor(name as keyof typeof DEFAULTS.colors, e.target.value)}
                                                                    className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors capitalize">{name}</span>
                                                        </label>
                                                        <span className="text-[10px] font-mono text-white/20 uppercase">{hex}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>

                                    <div className="h-[1px] bg-white/5" />

                                    <section>
                                        <h3 className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-6">Params</h3>
                                        <div className="space-y-6">
                                            {[
                                                { id: 'speed', label: 'Flow Speed', min: 0, max: 0.5, step: 0.01, dec: 2 },
                                                { id: 'warp', label: 'Warp Bloom', min: 0, max: 0.6, step: 0.01, dec: 2 },
                                                { id: 'noise', label: 'Noise Scale', min: 0.5, max: 4, step: 0.1, dec: 1 },
                                                { id: 'grain', label: 'Grain Film', min: 0, max: 0.15, step: 0.005, dec: 3 },
                                            ].map(slider => (
                                                <div key={slider.id} className="space-y-3">
                                                    <div className="flex items-center justify-between text-[11px]">
                                                        <span className="text-white/60">{slider.label}</span>
                                                        <span className="font-mono text-white/30">{(params[slider.id as keyof typeof DEFAULTS] as number).toFixed(slider.dec)}</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min={slider.min}
                                                        max={slider.max}
                                                        step={slider.step}
                                                        value={params[slider.id as keyof typeof DEFAULTS] as number}
                                                        onChange={(e) => updateSlider(slider.id as any, parseFloat(e.target.value))}
                                                        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-emerald-400 transition-all"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                                    <button
                                        onClick={handleCopyCode}
                                        className="btn-primary w-full py-3"
                                    >
                                        <Icon icon="solar:copy-linear" class="text-lg" />
                                        Copy shader code
                                    </button>
                                    <button
                                        onClick={handleSaveDesign}
                                        className="btn-ghost w-full py-3"
                                    >
                                        <Icon icon="solar:diskette-linear" class="text-lg" />
                                        Save Design
                                    </button>
                                    <button
                                        onClick={resetParams}
                                        className="btn-ghost w-full py-3 opacity-60 hover:opacity-100"
                                    >
                                        <Icon icon="solar:restart-linear" class="text-lg" />
                                        Reset defaults
                                    </button>
                                </div>
                            </motion.div>

                            {/* Mobile Sidebar - Modal with close button */}
                            {isPanelOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: 100, y: "-50%" }}
                                    animate={{ opacity: 1, x: 0, y: "-50%" }}
                                    exit={{ opacity: 0, x: 100, y: "-50%" }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    className="md:hidden fixed right-6 top-1/2 w-[320px] max-h-[85vh] overflow-y-auto glass rounded-3xl p-6 pointer-events-auto z-50 flex flex-col gap-8 shadow-2xl"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Icon icon="solar:settings-linear" class="text-lg text-white/40" />
                                            <h2 className="font-medium text-sm">Shader Editor</h2>
                                        </div>
                                        <button
                                            onClick={() => setIsPanelOpen(false)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                                        >
                                            <Icon icon="solar:close-square-linear" class="text-lg" />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <section>
                                            <h3 className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-4">Colors</h3>
                                            <div className="grid gap-4">
                                                {Object.entries(params.colors).map(([name, rgb]) => {
                                                    const hex = rgb01ToHex(rgb as [number, number, number]);
                                                    return (
                                                        <div key={name} className="flex items-center justify-between group">
                                                            <label className="flex items-center gap-4 cursor-pointer">
                                                                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/10">
                                                                    <input
                                                                        type="color"
                                                                        value={hex}
                                                                        onChange={(e) => updateColor(name as keyof typeof DEFAULTS.colors, e.target.value)}
                                                                        className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                                                                    />
                                                                </div>
                                                                <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors capitalize">{name}</span>
                                                            </label>
                                                            <span className="text-[10px] font-mono text-white/20 uppercase">{hex}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </section>

                                        <div className="h-[1px] bg-white/5" />

                                        <section>
                                            <h3 className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-6">Params</h3>
                                            <div className="space-y-6">
                                                {[
                                                    { id: 'speed', label: 'Flow Speed', min: 0, max: 0.5, step: 0.01, dec: 2 },
                                                    { id: 'warp', label: 'Warp Bloom', min: 0, max: 0.6, step: 0.01, dec: 2 },
                                                    { id: 'noise', label: 'Noise Scale', min: 0.5, max: 4, step: 0.1, dec: 1 },
                                                    { id: 'grain', label: 'Grain Film', min: 0, max: 0.15, step: 0.005, dec: 3 },
                                                ].map(slider => (
                                                    <div key={slider.id} className="space-y-3">
                                                        <div className="flex items-center justify-between text-[11px]">
                                                            <span className="text-white/60">{slider.label}</span>
                                                            <span className="font-mono text-white/30">{(params[slider.id as keyof typeof DEFAULTS] as number).toFixed(slider.dec)}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min={slider.min}
                                                            max={slider.max}
                                                            step={slider.step}
                                                            value={params[slider.id as keyof typeof DEFAULTS] as number}
                                                            onChange={(e) => updateSlider(slider.id as any, parseFloat(e.target.value))}
                                                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-emerald-400 transition-all"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>

                                    <div className="flex flex-col gap-3 pt-4">
                                        <button
                                            onClick={handleCopyCode}
                                            className="btn-primary w-full py-3"
                                        >
                                            <Icon icon="solar:copy-linear" class="text-lg" />
                                            Copy shader code
                                        </button>
                                        <button
                                            onClick={handleSaveDesign}
                                            className="btn-ghost w-full py-3"
                                        >
                                            <Icon icon="solar:diskette-linear" class="text-lg" />
                                            Save Design
                                        </button>
                                        <button
                                            onClick={resetParams}
                                            className="btn-ghost w-full py-3 opacity-60 hover:opacity-100"
                                        >
                                            <Icon icon="solar:restart-linear" class="text-lg" />
                                            Reset defaults
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                </AnimatePresence>

                {/* Mobile Floating Button */}
                <AnimatePresence>
                    {!isPanelOpen && !isFullScreen && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setIsPanelOpen(true)}
                            className="md:hidden fixed bottom-8 right-8 w-14 h-14 rounded-full glass flex items-center justify-center pointer-events-auto shadow-2xl hover:bg-white/20 transition-all z-40"
                        >
                            <Icon icon="solar:palette-linear" class="text-2xl text-white" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-full flex items-center gap-3 z-[200] pointer-events-auto shadow-2xl"
                    >
                        <Icon icon="solar:check-circle-linear" class="text-lg text-emerald-400" />
                        <span className="text-sm font-medium tracking-tight">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
