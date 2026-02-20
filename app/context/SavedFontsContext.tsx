'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { FontInfo, SavedFont } from '../types';

interface SavedFontsContextType {
    savedFonts: SavedFont[];
    saveFont: (font: FontInfo) => void;
    removeFont: (url: string) => void;
    updateNotes: (url: string, notes: string) => void;
    isSaved: (url: string) => boolean;
}

const SavedFontsContext = createContext<SavedFontsContextType | undefined>(undefined);

export function SavedFontsProvider({ children }: { children: React.ReactNode }) {
    const [savedFonts, setSavedFonts] = useState<SavedFont[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('saved-fonts');
        if (stored) {
            try {
                setSavedFonts(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse saved fonts', e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('saved-fonts', JSON.stringify(savedFonts));
        }
    }, [savedFonts, isLoaded]);

    const saveFont = (font: FontInfo) => {
        setSavedFonts((prev) => {
            if (prev.some((f) => f.url === font.url)) return prev;
            return [...prev, { ...font, savedAt: Date.now(), notes: '' }];
        });
    };

    const removeFont = (url: string) => {
        setSavedFonts((prev) => prev.filter((f) => f.url !== url));
    };

    const updateNotes = (url: string, notes: string) => {
        setSavedFonts((prev) =>
            prev.map((f) => (f.url === url ? { ...f, notes } : f))
        );
    };

    const isSaved = (url: string) => {
        return savedFonts.some((f) => f.url === url);
    };

    return (
        <SavedFontsContext.Provider
            value={{ savedFonts, saveFont, removeFont, updateNotes, isSaved }}
        >
            {children}
        </SavedFontsContext.Provider>
    );
}

export function useSavedFonts() {
    const context = useContext(SavedFontsContext);
    if (context === undefined) {
        throw new Error('useSavedFonts must be used within a SavedFontsProvider');
    }
    return context;
}
