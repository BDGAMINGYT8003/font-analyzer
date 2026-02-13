'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ThemeSegmentedControl from './components/ThemeSegmentedControl';
import HeroSection from './components/HeroSection';
import SearchInput from './components/SearchInput';
import FontGrid from './components/FontGrid';
import { FontInfo } from './types';

export default function Home() {
  const [fonts, setFonts] = useState<FontInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [previewText, setPreviewText] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);

  const handleSearch = async (targetUrl: string) => {
    setLoading(true);
    setError('');
    setFonts([]);
    setSearched(true);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract fonts');
      }

      // Sort fonts: normal style first, then regular weight (400) preferred
      const sortedFonts = [...data.fonts].sort((a: FontInfo, b: FontInfo) => {
        const aIsItalic = a.style?.toLowerCase().includes('italic') ? 1 : 0;
        const bIsItalic = b.style?.toLowerCase().includes('italic') ? 1 : 0;
        if (aIsItalic !== bIsItalic) return aIsItalic - bIsItalic;

        const aWeight = parseInt(a.weight || '400');
        const bWeight = parseInt(b.weight || '400');
        const aDiff = Math.abs(aWeight - 400);
        const bDiff = Math.abs(bWeight - 400);
        return aDiff - bDiff;
      });

      sortedFonts.sort((a: FontInfo, b: FontInfo) => a.family.localeCompare(b.family));
      setFonts(sortedFonts);

      if (sortedFonts.length === 0) {
        setError('No fonts found on this website');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFonts([]);
    setSearched(false);
    setError('');
    setLoading(false);
    setPreviewText('');
    setResetKey(prev => prev + 1);
    setRemoveDuplicates(false);
  };

  const uniqueFonts = fonts.filter((font, index, self) =>
    index === self.findIndex((t) => (
      t.family === font.family
    ))
  );

  const displayedFonts = removeDuplicates ? uniqueFonts : fonts;

  return (
    <main className="min-h-screen bg-background relative transition-colors duration-300">
      {/* Background Pattern */}
      <div className="fixed inset-0 h-full w-full bg-background pointer-events-none transition-colors duration-300">
        <div className="absolute h-full w-full bg-[radial-gradient(var(--gray-200)_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Search Input */}
        <div className="mt-10">
          <SearchInput
            key={resetKey}
            onSearch={handleSearch}
            loading={loading}
            hasResults={fonts.length > 0}
            removeDuplicates={removeDuplicates}
            onRemoveDuplicatesChange={setRemoveDuplicates}
          />
        </div>

        {/* Results Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-center text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Header */}
          <AnimatePresence mode="wait">
            {fonts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="mb-4 flex justify-between items-center"
              >
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Found {fonts.length} {fonts.length === 1 ? 'font' : 'fonts'}
                </h2>

                <button
                  onClick={handleClear}
                  className="group flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200 focus:outline-none"
                  aria-label="Clear all results"
                >
                    <span className="p-1 rounded-md bg-gray-100 dark:bg-zinc-800 group-hover:bg-red-50 dark:group-hover:bg-red-900/30 transition-colors duration-200">
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </span>
                    Clear
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Custom Preview Text */}
          {fonts.length > 0 && (
            <div className="mb-6">
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
          )}

          {/* Font Grid */}
          <AnimatePresence mode="wait">
            {displayedFonts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FontGrid fonts={displayedFonts} previewText={previewText} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          <AnimatePresence mode="wait">
            {searched && !loading && fonts.length === 0 && !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500">No fonts found on this website</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Footer */}
        <footer className="py-10 md:py-16 border-t border-gray-200 mt-10 md:mt-20">
          <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
            {/* Supported Formats */}
            <div className="mb-12 text-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">Supported Formats</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['WOFF', 'WOFF2', 'TTF', 'OTF'].map((format) => (
                  <span key={format} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700/50 text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
                    {format}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-5 text-lg text-gray-500 leading-relaxed max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Disclaimer</h3>
              
              <p className="text-lg">
                Analyze Any Font is a developer utility designed to help designers and developers inspect and identify typography used on the web for testing and research purposes.
              </p>

              <p className="text-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Respect Licenses:</span> Many web fonts are licensed software. Identifying or downloading a font does not grant you a license to use it. You are responsible for ensuring you have the appropriate rights or licenses for any font you reuse.
              </p>

              <p className="text-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Download Responsibility:</span> While this tool allows you to download font files directly, you do so at your own risk. These files are provided &quot;as-is&quot; without warranty. Downloading a file does not transfer copyright or ownership. You are solely responsible for any legal consequences or copyright infringements that may arise from possessing or using proprietary or unlicensed fonts.
              </p>

              <p className="text-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-300">No Circumvention:</span> This tool only detects styles that are already sent to your browser for rendering. It does not bypass DRM, decrypt secured files, or access private directories.
              </p>

              <p className="text-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-300">User Responsibility:</span> The author of this tool assumes no liability for the misuse of information or files provided. Please support type foundries by purchasing proper licenses for your projects.
              </p>
            </div>

            <div className="mt-16 flex flex-col items-center justify-center gap-6 opacity-80">
                <ThemeSegmentedControl />
                <div className="flex flex-col items-center justify-center gap-1.5">
                    <p className="text-sm text-gray-400">&copy; 2026 Analyze Any Font.</p>
                    <p className="text-sm text-gray-400">Built for the design community</p>
                </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
