/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    SiWebgl,
    SiTailwindcss,
    SiTypescript,
    SiJson,
    SiCss,
} from 'react-icons/si';
import { DiCss3 } from "react-icons/di";
import { MdVideoLibrary } from 'react-icons/md';
import { BiLogoFigma } from 'react-icons/bi';
import {
    exportWebGL,
    exportTailwind,
    exportCSS,
    exportTypeScript,
    exportFigma,
    VideoCapture,
    ShaderParams
} from '../exportTypes';

const Icon = ({ icon, class: className }: { icon: string; class?: string }) => {
    // @ts-ignore
    return <iconify-icon icon={icon} class={className} />;
};

type ExportType = 'webgl' | 'tailwind' | 'css' | 'typescript' | 'figma' | 'video';

interface ExportDropdownProps {
    params: ShaderParams;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    onShowToast: (message: string) => void;
}

const exportOptions: Array<{
    id: ExportType;
    label: string;
    description: string;
    icon: React.ReactNode;
}> = [
        {
            id: 'webgl',
            label: 'WebGL',
            description: 'HTML + JavaScript',
            icon: <SiWebgl size={18} />
        },
        {
            id: 'tailwind',
            label: 'Tailwind',
            description: 'Tailwind Config',
            icon: <SiTailwindcss size={18} />
        },
        {
            id: 'css',
            label: 'CSS',
            description: 'CSS Variables',
            icon: <SiCss size={18} />
        },
        {
            id: 'typescript',
            label: 'TypeScript',
            description: 'TS Configuration',
            icon: <SiTypescript size={18} />
        },
        {
            id: 'figma',
            label: 'Figma',
            description: 'Figma Variables',
            icon: <BiLogoFigma size={18} />
        },
        {
            id: 'video',
            label: 'Video',
            description: '10sec Video',
            icon: <MdVideoLibrary size={18} />
        }
    ];

export function ExportDropdown({ params, canvasRef, onShowToast }: ExportDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingProgress, setRecordingProgress] = useState(0);
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
    const videoCapture = useRef<VideoCapture | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExport = (type: ExportType) => {
        if (type === 'video') {
            setIsOpen(false);
            return;
        }

        let content = '';
        let filename = '';
        let mimeType = 'text/plain';

        switch (type) {
            case 'webgl':
                content = exportWebGL(params);
                filename = 'fluid-gradient.html';
                mimeType = 'text/html';
                break;
            case 'tailwind':
                content = exportTailwind(params);
                filename = 'tailwind.config.js';
                mimeType = 'text/javascript';
                break;
            case 'css':
                content = exportCSS(params);
                filename = 'fluid-gradient.css';
                mimeType = 'text/css';
                break;
            case 'typescript':
                content = exportTypeScript(params);
                filename = 'fluid-gradient.config.ts';
                mimeType = 'text/typescript';
                break;
            case 'figma':
                content = exportFigma(params);
                filename = 'figma-variables.json';
                mimeType = 'application/json';
                break;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        onShowToast(`Downloaded ${filename}`);
        setIsOpen(false);
    };

    const startVideoRecording = async () => {
        if (!canvasRef.current) {
            onShowToast('Canvas not found');
            return;
        }

        try {
            setIsRecording(true);
            setVideoBlob(null);
            setRecordingProgress(0);

            // Get the canvas element - should be the full-screen WebGL canvas
            const canvas = canvasRef.current;

            // Ensure canvas has proper dimensions
            if (!canvas.width || !canvas.height) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            console.log('Starting video capture:', {
                width: canvas.width,
                height: canvas.height,
                tagName: canvas.tagName
            });

            const vc = new VideoCapture(canvas);
            videoCapture.current = vc;

            await vc.startRecording(10000); // 10 seconds

            // Update progress every 100ms
            let elapsed = 0;
            const interval = setInterval(() => {
                elapsed += 100;
                const progress = Math.min((elapsed / 10000) * 100, 100);
                setRecordingProgress(progress);

                if (elapsed >= 10000) {
                    clearInterval(interval);
                }
            }, 100);
        } catch (error) {
            console.error('Error starting recording:', error);
            onShowToast(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsRecording(false);
            setRecordingProgress(0);
        }
    };

    const stopVideoRecording = async () => {
        if (!videoCapture.current) {
            onShowToast('No recording in progress');
            return;
        }

        try {
            const blob = await videoCapture.current.stopRecording();

            if (!blob || blob.size === 0) {
                onShowToast('No video data recorded');
                setIsRecording(false);
                setRecordingProgress(0);
                return;
            }

            setVideoBlob(blob);
            setIsRecording(false);
            setRecordingProgress(0);
            console.log('Video recorded:', {
                size: blob.size,
                type: blob.type
            });
            onShowToast(`Video recorded (${(blob.size / 1024 / 1024).toFixed(2)} MB)`);
        } catch (error) {
            console.error('Error stopping recording:', error);
            onShowToast(`Error: ${error instanceof Error ? error.message : 'Recording failed'}`);
            setIsRecording(false);
            setRecordingProgress(0);
        }
    };

    const downloadVideo = () => {
        if (!videoBlob || !videoCapture.current) return;
        videoCapture.current.downloadVideo(videoBlob, 'fluid-gradient.webm');
        onShowToast('Video downloaded');
        setVideoBlob(null);
    };

    const getVideoURL = () => {
        if (!videoBlob || !videoCapture.current) return '';
        return videoCapture.current.getVideoURL(videoBlob);
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full btn-ghost py-3 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <Icon icon="solar:download-linear" class="text-lg" />
                    <span>Export as</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Icon icon="solar:alt-arrow-down-linear" class="text-sm" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-full left-0 right-0 mb-2 bg-zinc-900 border border-white/10 rounded-lg overflow-hidden shadow-lg z-50"
                    >
                        {!videoBlob && !isRecording ? (
                            <div className="py-2">
                                {exportOptions.map((option) => (
                                    <motion.button
                                        key={option.id}
                                        onClick={() => {
                                            if (option.id === 'video') {
                                                startVideoRecording();
                                            } else {
                                                handleExport(option.id);
                                            }
                                        }}
                                        className="w-full px-4 py-2 hover:bg-white/10 transition-colors text-left flex items-center gap-3 group"
                                        whileHover={{ x: 4 }}
                                    >
                                        <div className="text-white/60 group-hover:text-white transition-colors">
                                            {option.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium">{option.label}</div>
                                            <div className="text-xs text-white/40">{option.description}</div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 space-y-4">
                                {isRecording && (
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">Recording...</div>
                                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                            <motion.div
                                                className="bg-red-500 h-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${recordingProgress}%` }}
                                                transition={{ duration: 0.1 }}
                                            />
                                        </div>
                                        <div className="text-xs text-white/60">{Math.round(recordingProgress)}%</div>
                                        <button
                                            onClick={stopVideoRecording}
                                            className="w-full mt-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Icon icon="solar:stop-linear" class="text-lg" />
                                            Stop
                                        </button>
                                    </div>
                                )}

                                {videoBlob && (
                                    <div className="space-y-2">
                                        <video
                                            src={getVideoURL()}
                                            controls
                                            className="w-full rounded bg-black aspect-video max-h-[200px]"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={downloadVideo}
                                                className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded py-2 text-sm font-medium transition-colors"
                                            >
                                                Download
                                            </button>
                                            <button
                                                onClick={() => setVideoBlob(null)}
                                                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded py-2 px-3 text-sm font-medium transition-colors"
                                            >
                                                <Icon icon="solar:close-square-linear" class="text-lg" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
