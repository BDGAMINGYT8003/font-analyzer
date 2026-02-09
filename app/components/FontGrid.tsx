'use client';

import { FontInfo } from '../types';
import FontCard from './FontCard';
import { LayoutGroup } from 'motion/react';

interface FontGridProps {
    fonts: FontInfo[];
    previewText?: string;
}

export default function FontGrid({ fonts, previewText }: FontGridProps) {
    return (
        <LayoutGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {fonts.map((font, index) => (
                    <FontCard
                        key={`${font.url}-${index}`}
                        font={font}
                        index={index}
                        previewText={previewText}
                    />
                ))}
            </div>
        </LayoutGroup>
    );
}
