'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSavedFonts } from '../context/SavedFontsContext';
import FontGrid from '../components/FontGrid';
import Link from 'next/link';

export default function SavedFontsPage() {
    const { savedFonts } = useSavedFonts();
    const [searchQuery, setSearchQuery] = useState('');
    const [previewText, setPreviewText] = useState('');

    const filteredFonts = savedFonts.filter((font) =>
        font.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
        font.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-background relative transition-colors duration-300">
            {/* Background Pattern */}
            <div className="fixed inset-0 h-full w-full bg-background pointer-events-none transition-colors duration-300">
                <div className="absolute h-full w-full bg-[radial-gradient(var(--gray-200)_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Search
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                            Saved Library
                        </h1>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Manage your collection of {savedFonts.length} saved {savedFonts.length === 1 ? 'font' : 'fonts'}.
                        </p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="mb-8 grid gap-4 md:grid-cols-2">
                    {/* Search */}
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search saved fonts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-150"
                        />
                    </div>

                    {/* Preview Text */}
                    <div className="relative">
                        <input
                            type="text"
                            value={previewText}
                            onChange={(e) => setPreviewText(e.target.value)}
                            placeholder="Type custom preview text…"
                            className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-150"
                        />
                         {previewText && (
                            <button
                                onClick={() => setPreviewText('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {filteredFonts.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FontGrid fonts={filteredFonts} previewText={previewText} showNotes={true} />
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-center py-20"
                        >
                             <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                                {savedFonts.length === 0 ? "No saved fonts yet" : "No fonts found"}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                {savedFonts.length === 0
                                    ? "Start exploring and save fonts you like to build your personal library."
                                    : "Try adjusting your search terms to find what you're looking for."}
                            </p>
                            {savedFonts.length === 0 && (
                                <Link href="/" className="inline-block mt-6 px-6 py-3 bg-gray-900 text-white dark:bg-white dark:text-black rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                                    Discover Fonts
                                </Link>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
