'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FontInfo, FontAlternative } from '../types';
import { useSavedFonts } from '../context/SavedFontsContext';

interface FontCardProps {
    font: FontInfo;
    index: number;
    previewText?: string;
    showNotes?: boolean;
}

export default function FontCard({ font, index, previewText, showNotes = false }: FontCardProps) {
    const { saveFont, removeFont, isSaved, updateNotes, savedFonts } = useSavedFonts();
    const [fontLoaded, setFontLoaded] = useState(false);
    const [showAlternatives, setShowAlternatives] = useState(false);
    const [alternatives, setAlternatives] = useState<FontAlternative[]>([]);
    const [loadingAlternatives, setLoadingAlternatives] = useState(false);

    // Download state
    const [showConsentPrompt, setShowConsentPrompt] = useState(false);
    const [consentChecked, setConsentChecked] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // CSS Code state
    const [showCss, setShowCss] = useState(false);
    const [copied, setCopied] = useState(false);

    const isSavedState = isSaved(font.url);

    // Only proxy external URLs, keep data URLs as is
    const isDataUrl = font.url.startsWith('data:');
    const displayUrl = isDataUrl
        ? font.url
        : `/api/font?url=${encodeURIComponent(font.url)}&referer=${encodeURIComponent(font.referer || '')}`;

    useEffect(() => {
        const fontId = `font-preview-${index}`;
        const existingStyle = document.getElementById(fontId);
        if (existingStyle) existingStyle.remove();

        const style = document.createElement('style');
        style.id = fontId;
        style.textContent = `
      @font-face {
        font-family: 'PreviewFont${index}';
        src: url('${displayUrl}');
        font-weight: ${font.weight || 'normal'};
        font-style: ${font.style || 'normal'};
      }
    `;
        document.head.appendChild(style);

        // Faster timeout for data URLs as they don't need network fetch
        setTimeout(() => setFontLoaded(true), isDataUrl ? 100 : 800);

        return () => {
            const el = document.getElementById(fontId);
            if (el) el.remove();
        };
    }, [font, index, displayUrl, isDataUrl]);

    const handleSaveToggle = () => {
        if (isSavedState) {
            removeFont(font.url);
        } else {
            saveFont(font);
        }
    };

    const findAlternatives = async () => {
        if (alternatives.length > 0) {
            setShowAlternatives(!showAlternatives);
            return;
        }

        setLoadingAlternatives(true);
        try {
            const response = await fetch('/api/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    family: font.family,
                    weight: font.weight,
                    style: font.style,
                    url: font.url,
                    referer: font.referer || ''
                })
            });

            const data = await response.json();
            if (data.alternatives) {
                setAlternatives(data.alternatives);
                setShowAlternatives(true);
            }
        } catch (error) {
            console.error('Failed to find alternatives:', error);
        } finally {
            setLoadingAlternatives(false);
        }
    };

    const performDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch(displayUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Extract extension from format or URL, default to woff2
            let ext = 'woff2';
            if (font.format) {
                ext = font.format.toLowerCase();
            } else if (font.url && !isDataUrl) {
                const match = font.url.match(/\.(woff2?|ttf|otf|eot)$/i);
                if (match) ext = match[1].toLowerCase();
            }

            const filename = `${font.family.replace(/\s+/g, '-')}-${font.weight || 'regular'}.${ext}`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownload = () => {
        const hasConsented = typeof window !== 'undefined' && localStorage.getItem('font-download-consent') === 'true';

        if (hasConsented) {
            performDownload();
            return;
        }

        if (!showConsentPrompt) {
            setShowConsentPrompt(true);
            return;
        }

        if (consentChecked) {
            localStorage.setItem('font-download-consent', 'true');
            setShowConsentPrompt(false);
            performDownload();
        }
    };

    const generateCssCode = () => {
        const slug = font.family.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const weight = font.weight || 'normal';
        const style = font.style || 'normal';

        return `@font-face {
  font-family: '${font.family}';
  src: url('${font.url}') format('${font.format?.toLowerCase() || 'woff2'}');
  font-weight: ${weight};
  font-style: ${style};
  font-display: swap;
}

.${slug} {
  font-family: '${font.family}', sans-serif;
}`;
    };

    const handleCopyCss = () => {
        navigator.clipboard.writeText(generateCssCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 3500);
    };

    const formatBadgeStyle = (format: string): string => {
        const styles: Record<string, string> = {
            'WOFF2': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
            'WOFF': 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            'TRUETYPE': 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
            'TTF': 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
            'OPENTYPE': 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
            'OTF': 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
            'EOT': 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
        };
        return styles[format.toUpperCase()] || 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400';
    };

    // Determine the current notes value if showing notes
    const currentNotes = showNotes
        ? savedFonts.find(f => f.url === font.url)?.notes || ''
        : '';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1],
                delay: index * 0.05
            }}
            className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] transition-all duration-200 ease"
        >
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                    <div className="flex-1 min-w-0 mr-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate" title={font.family}>
                            {font.family}
                        </h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 truncate mt-0.5" title={font.name}>
                            {font.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                         {/* Save Button */}
                         <button
                            onClick={handleSaveToggle}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                                isSavedState
                                ? 'bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-zinc-800 dark:text-gray-500 dark:hover:bg-zinc-700 dark:hover:text-gray-300'
                            }`}
                            aria-label={isSavedState ? "Unsave font" : "Save font"}
                            title={isSavedState ? "Remove from saved" : "Save to library"}
                        >
                            <svg className={`w-4 h-4 ${isSavedState ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSavedState ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${formatBadgeStyle(font.format)}`}>
                            {font.format}
                        </span>
                    </div>
                </div>

                {/* Font Preview */}
                <div className="mb-5 p-5 bg-gray-50 dark:bg-black rounded-xl min-h-[100px] flex items-center justify-center border border-transparent dark:border-zinc-800">
                    {fontLoaded ? (
                        <p
                            className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 text-center leading-relaxed"
                            style={{
                                fontFamily: `'PreviewFont${index}', sans-serif`,
                                fontStyle: font.style || 'normal',
                                fontWeight: font.weight || 'normal'
                            }}
                        >
                            {previewText || 'The quick brown fox jumps over the lazy dog'}
                        </p>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-600">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span className="text-sm">Loading preview…</span>
                        </div>
                    )}
                </div>

                {/* Notes Section (Only if enabled) */}
                {showNotes && (
                    <div className="mb-5">
                         <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Personal Notes
                        </label>
                        <textarea
                            value={currentNotes}
                            onChange={(e) => updateNotes(font.url, e.target.value)}
                            placeholder="Add notes about this font..."
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y min-h-[80px]"
                        />
                    </div>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        <span className="tabular-nums">{font.weight || '400'}</span>
                    </span>
                    <span className="flex items-center gap-1.5 capitalize">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                        {font.style || 'Normal'}
                    </span>
                </div>

                {/* Download Section */}
                <div className="space-y-3 mb-2">
                    <AnimatePresence>
                        {showConsentPrompt && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="overflow-hidden"
                            >
                                <label className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 cursor-pointer select-none group/checkbox">
                                    <div className="relative flex items-center mt-0.5">
                                        <input
                                            type="checkbox"
                                            checked={consentChecked}
                                            onChange={(e) => setConsentChecked(e.target.checked)}
                                            className="peer w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500 dark:border-amber-700 dark:bg-zinc-800 dark:checked:bg-amber-600 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                                        I understand this font may be proprietary and downloading/using it could have legal or security implications.
                                    </span>
                                </label>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        onClick={handleDownload}
                        disabled={isDownloading || (showConsentPrompt && !consentChecked)}
                        whileTap={{ scale: 0.97 }}
                        className={`
                            w-full py-3 px-4 min-h-[44px]
                            text-sm font-medium
                            rounded-xl
                            transition-all duration-200 ease
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white
                            flex items-center justify-center gap-2
                            ${isDownloading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-gray-600'
                                : (showConsentPrompt && !consentChecked)
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-gray-600 opacity-50'
                                    : 'bg-gray-900 text-white hover:bg-black active:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-sm hover:shadow-md'
                            }
                        `}
                    >
                        {isDownloading ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Downloading...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {showConsentPrompt && !consentChecked ? 'Confirm & Download' : 'Download Font'}
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Show CSS Code Button */}
                <motion.button
                    onClick={() => setShowCss(!showCss)}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 px-4 min-h-[44px] mt-2 text-sm font-medium rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700 transition-all duration-150 ease flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    {showCss ? 'Hide CSS Code' : 'Show CSS Code'}
                </motion.button>

                {/* CSS Code Drawer */}
                <AnimatePresence>
                    {showCss && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 relative group/code">
                                <pre className="p-4 bg-zinc-900 rounded-xl overflow-x-auto text-xs font-mono text-zinc-300 leading-relaxed border border-zinc-800 custom-scrollbar">
                                    <code>{generateCssCode()}</code>
                                </pre>
                                <button
                                    onClick={handleCopyCss}
                                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all duration-200 opacity-0 group-hover/code:opacity-100 focus:opacity-100 sm:opacity-0 sm:group-hover/code:opacity-100"
                                    aria-label="Copy CSS"
                                    title="Copy to clipboard"
                                >
                                    {copied ? (
                                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Find Alternatives Button */}
                <motion.button
                    onClick={findAlternatives}
                    disabled={loadingAlternatives}
                    whileTap={{ scale: 0.97 }}
                    className={`
            w-full py-3 px-4 min-h-[44px] mt-2
            text-sm font-medium
            rounded-xl
            transition-all duration-150 ease
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            ${loadingAlternatives
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-gray-600'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30'
                        }
          `}
                >
                    {loadingAlternatives ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Finding alternatives…
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            {alternatives.length > 0 ? (showAlternatives ? 'Hide' : 'Show') + ' Free Alternatives' : 'Find Free Alternatives'}
                        </span>
                    )}
                </motion.button>

                {/* Alternatives Display */}
                <AnimatePresence>
                    {showAlternatives && alternatives.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800"
                        >
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Free Alternatives
                            </h4>
                            <div className="space-y-2">
                                {alternatives.map((alt, i) => (
                                    <motion.a
                                        key={i}
                                        href={alt.downloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="block p-3 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-150 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0 mr-3">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-gray-900 dark:text-gray-200 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {alt.family}
                                                    </p>
                                                    {alt.similarity != null && alt.similarity > 0 && (
                                                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${
                                                            alt.similarity >= 80 ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                                            alt.similarity >= 60 ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                            'bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400'
                                                        }`}>
                                                            {alt.similarity}%
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                    {alt.reason || alt.category}
                                                </p>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 italic">
                                These Google Fonts are free to use commercially and personally
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
