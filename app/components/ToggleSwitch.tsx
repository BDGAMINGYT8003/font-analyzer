
'use client';

import { motion } from 'motion/react';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}

export default function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 select-none">
                {label}
            </span>
            <button
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`
                    relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
                    transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2
                    focus-visible:ring-gray-900 dark:focus-visible:ring-gray-400 focus-visible:ring-offset-2
                    ${checked ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-zinc-700'}
                `}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-black shadow ring-0
                        transition duration-200 ease-in-out
                        ${checked ? 'translate-x-5' : 'translate-x-0'}
                    `}
                />
            </button>
        </div>
    );
}
