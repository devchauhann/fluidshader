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
    SiFigma,
    SiCss,
} from 'react-icons/si';
import {
    exportWebGL,
    exportTailwind,
    exportCSS,
    exportTypeScript,
    exportFigma,
    ShaderParams
} from '../exportTypes';

const Icon = ({ icon, class: className }: { icon: string; class?: string }) => {
    // @ts-ignore
    return <iconify-icon icon={icon} class={className} />;
};

type CopyType = 'webgl' | 'tailwind' | 'css' | 'typescript' | 'figma';

interface CopyDropdownProps {
    params: ShaderParams;
    onShowToast: (message: string) => void;
}

const copyOptions: Array<{
    id: CopyType;
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
            icon: <SiFigma size={18} />
        }
    ];

export function CopyDropdown({ params, onShowToast }: CopyDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
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

    const handleCopy = (type: CopyType) => {
        let content = '';

        switch (type) {
            case 'webgl':
                content = exportWebGL(params);
                break;
            case 'tailwind':
                content = exportTailwind(params);
                break;
            case 'css':
                content = exportCSS(params);
                break;
            case 'typescript':
                content = exportTypeScript(params);
                break;
            case 'figma':
                content = exportFigma(params);
                break;
        }

        navigator.clipboard.writeText(content).then(() => {
            onShowToast(`Copied ${copyOptions.find(o => o.id === type)?.label} to clipboard`);
            setIsOpen(false);
        }).catch((error) => {
            console.error('Copy failed:', error);
            onShowToast('Failed to copy to clipboard');
        });
    };

    return (
        <div ref={dropdownRef} className="relative group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn-primary w-full py-3 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <Icon icon="solar:copy-linear" class="text-lg" />
                    <span>Copy code</span>
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
                        <div className="py-2">
                            {copyOptions.map((option) => (
                                <motion.button
                                    key={option.id}
                                    onClick={() => handleCopy(option.id)}
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
