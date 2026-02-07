import React, { createContext, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    useEffect(() => {
        // Always apply dark mode
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }, []);

    return (
        <ThemeContext.Provider value={{ isDarkMode: true }}>
            {children}
        </ThemeContext.Provider>
    );
};
