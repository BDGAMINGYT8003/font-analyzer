'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ToggleSwitch from './ToggleSwitch';

interface SearchInputProps {
    onSearch: (url: string) => void;
    loading: boolean;
    hasResults: boolean;
    removeDuplicates: boolean;
    onRemoveDuplicatesChange: (checked: boolean) => void;
}

export default function SearchInput({
    onSearch,
    loading,
    hasResults,
    removeDuplicates,
    onRemoveDuplicatesChange
}: SearchInputProps) {
    const [url, setUrl] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim() || loading) return;

        let targetUrl = url.trim();
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }
        onSearch(targetUrl);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
            className="w-full max-w-2xl mx-auto px-4 md:px-6"
        >
            <form onSubmit={handleSubmit}>
                <div
                    className={`
            relative flex flex-col sm:flex-row items-stretch sm:items-center
            bg-white dark:bg-zinc-900 rounded-2xl
            transition-shadow duration-200 ease
            ${isFocused
                            ? 'shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_24px_-4px_rgba(0,0,0,0.12)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_24px_-4px_rgba(0,0,0,0.5)]'
                            : 'shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_2px_8px_-2px_rgba(0,0,0,0.3)]'
                        }
          `}
                >
                    {/* Input Wrapper */}
                    <div className="flex-1 flex items-center min-w-0">
                        <div className="pl-5 pr-2 hidden sm:block">
                            <svg
                                className={`w-5 h-5 transition-colors duration-150 ${isFocused ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Enter website URL"
                            className="
                  flex-1
                  py-4 px-5 sm:px-2
                  text-base text-gray-900 dark:text-white
                  placeholder:text-gray-400 dark:placeholder:text-gray-600
                  bg-transparent
                  outline-none
                  min-w-0
                "
                            style={{ fontSize: '16px' }} /* Prevent iOS zoom */
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="p-2 sm:pr-2">
                        <motion.button
                            type="submit"
                            disabled={loading || !url.trim()}
                            whileTap={{ scale: 0.97 }}
                            className={`
                w-full sm:w-auto
                px-5 py-2.5
                text-sm font-medium
                rounded-xl
                transition-all duration-150 ease
                outline-none
                flex items-center justify-center
                ${loading || !url.trim()
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-gray-600'
                                    : 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950 dark:bg-white dark:text-black dark:hover:bg-gray-200'
                                }
              `}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12" cy="12" r="10"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Scanning
                                </span>
                            ) : (
                                'Extract'
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Helper text area - Swaps with Toggle */}
                <div className="relative mt-3 min-h-[2rem] flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                        {!hasResults ? (
                            <motion.p
                                key="helper-text"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="text-center text-sm text-gray-400 leading-relaxed px-4"
                            >
                                <span>
                                    Try <button
                                        type="button"
                                        onClick={() => { setUrl('stripe.com'); inputRef.current?.focus(); }}
                                        className="text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors duration-150"
                                    >stripe.com</button>, <button
                                        type="button"
                                        onClick={() => { setUrl('linear.app'); inputRef.current?.focus(); }}
                                        className="text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors duration-150"
                                    >linear.app</button>, or <button
                                        type="button"
                                        onClick={() => { setUrl('vercel.com'); inputRef.current?.focus(); }}
                                        className="text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors duration-150"
                                    >vercel.com</button>
                                </span>
                            </motion.p>
                        ) : (
                            <motion.div
                                key="toggle-controls"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-center pointer-events-auto w-full"
                            >
                                <div className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700/50 flex flex-wrap items-center justify-center gap-3 shadow-sm mx-auto max-w-full">
                                    <ToggleSwitch
                                        label="Remove Duplicates (Beta)"
                                        checked={removeDuplicates}
                                        onChange={onRemoveDuplicatesChange}
                                        reverseOrder={true}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        </motion.div>
    );
}
