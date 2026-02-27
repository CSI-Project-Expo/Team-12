import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:bg-slate-200 dark:hover:bg-slate-800 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
            aria-label="Toggle Dark Mode"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
            <div className="relative h-6 w-6">
                <Sun
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isDarkMode ? 'rotate-0 scale-100 opacity-100 text-yellow-500' : 'rotate-90 scale-0 opacity-0'
                        }`}
                />
                <Moon
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${!isDarkMode ? 'rotate-0 scale-100 opacity-100 text-slate-600' : '-rotate-90 scale-0 opacity-0'
                        }`}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
