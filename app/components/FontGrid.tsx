'use client';

import { useEffect, useState } from 'react';
import { FontInfo } from '../types';
import FontCard from './FontCard';
import { motion, LayoutGroup } from 'motion/react';

interface FontGridProps {
    fonts: FontInfo[];
    previewText?: string;
}

export default function FontGrid({ fonts, previewText }: FontGridProps) {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    // Split fonts into two columns for masonry effect on desktop
    const leftColumn = fonts.filter((_, i) => i % 2 === 0);
    const rightColumn = fonts.filter((_, i) => i % 2 === 1);

    if (!isDesktop) {
        return (
            <div className="flex flex-col gap-6">
                {fonts.map((font, index) => (
                    <FontCard key={`${font.url}-${index}`} font={font} index={index} previewText={previewText} />
                ))}
            </div>
        );
    }

    return (
        <LayoutGroup>
            <div className="flex flex-row gap-6 items-start">
                <div className="flex-1 flex flex-col gap-6">
                    {leftColumn.map((font, i) => (
                        <FontCard
                            key={`${font.url}-${i * 2}`}
                            font={font}
                            index={i * 2}
                            previewText={previewText}
                        />
                    ))}
                </div>
                <div className="flex-1 flex flex-col gap-6">
                    {rightColumn.map((font, i) => (
                        <FontCard
                            key={`${font.url}-${i * 2 + 1}`}
                            font={font}
                            index={i * 2 + 1}
                            previewText={previewText}
                        />
                    ))}
                </div>
            </div>
        </LayoutGroup>
    );
}
