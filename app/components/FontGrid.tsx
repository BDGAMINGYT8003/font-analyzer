'use client';

import { FontInfo } from '../types';
import FontCard from './FontCard';
import { LayoutGroup } from 'motion/react';

interface FontGridProps {
    fonts: FontInfo[];
    previewText?: string;
}

export default function FontGrid({ fonts, previewText }: FontGridProps) {
    // Split fonts for desktop masonry layout (evens left, odds right)
    const leftColumnFonts = fonts.filter((_, i) => i % 2 === 0);
    const rightColumnFonts = fonts.filter((_, i) => i % 2 !== 0);

    return (
        <LayoutGroup>
            {/* Mobile Layout (Single Column) - Hidden on md+ */}
            <div className="flex flex-col gap-6 md:hidden">
                {fonts.map((font, index) => (
                    <FontCard
                        key={`mobile-${font.url}-${index}`}
                        font={font}
                        index={index}
                        previewText={previewText}
                    />
                ))}
            </div>

            {/* Desktop Layout (2-Column Masonry) - Hidden on mobile */}
            <div className="hidden md:flex flex-row gap-6 items-start">
                {/* Left Column */}
                <div className="flex flex-col gap-6 flex-1 min-w-0">
                    {leftColumnFonts.map((font, index) => {
                         const originalIndex = index * 2;
                         return (
                            <FontCard
                                key={`desktop-${font.url}-${originalIndex}`}
                                font={font}
                                index={originalIndex}
                                previewText={previewText}
                            />
                        );
                    })}
                </div>
                {/* Right Column */}
                <div className="flex flex-col gap-6 flex-1 min-w-0">
                    {rightColumnFonts.map((font, index) => {
                         const originalIndex = index * 2 + 1;
                         return (
                            <FontCard
                                key={`desktop-${font.url}-${originalIndex}`}
                                font={font}
                                index={originalIndex}
                                previewText={previewText}
                            />
                        );
                    })}
                </div>
            </div>
        </LayoutGroup>
    );
}
