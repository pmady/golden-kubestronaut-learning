/**
 * Dark Mode Theme Persistence
 * Implements persistent theme preference with system preference detection
 */

(function() {
    'use strict';

    // Theme configuration
    const THEMES = {
        LIGHT: 'default',
        DARK: 'slate'
    };

    const STORAGE_KEY = 'theme-preference';
    const SYSTEM_PREFERENCE_KEY = 'system-preference';

    /**
     * Get system preference for dark mode
     */
    function getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEMES.DARK;
        }
        return THEMES.LIGHT;
    }

    /**
     * Get saved theme preference from localStorage
     */
    function getSavedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            console.warn('Unable to access localStorage:', e);
            return null;
        }
    }

    /**
     * Save theme preference to localStorage
     */
    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            console.warn('Unable to save theme preference:', e);
        }
    }

    /**
     * Check if user prefers system theme
     */
    function prefersSystemTheme() {
        try {
            return localStorage.getItem(SYSTEM_PREFERENCE_KEY) === 'true';
        } catch (e) {
            return false;
        }
    }

    /**
     * Set system preference flag
     */
    function setSystemPreference(prefers) {
        try {
            localStorage.setItem(SYSTEM_PREFERENCE_KEY, prefers.toString());
        } catch (e) {
            console.warn('Unable to save system preference:', e);
        }
    }

    /**
     * Apply theme with smooth transition
     */
    function applyTheme(theme, animate = true) {
        const body = document.body;
        
        if (animate) {
            // Add transition class for smooth theme switching
            body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        }

        // Remove existing theme classes
        body.classList.remove('md-theme--default', 'md-theme--slate');
        
        // Add new theme class
        body.classList.add(`md-theme--${theme}`);
        
        // Update data-theme attribute for custom CSS
        document.documentElement.setAttribute('data-theme', theme);

        // Remove transition after animation completes
        if (animate) {
            setTimeout(() => {
                body.style.transition = '';
            }, 300);
        }

        // Update theme toggle buttons
        updateThemeToggleButtons(theme);
    }

    /**
     * Update theme toggle buttons state
     */
    function updateThemeToggleButtons(currentTheme) {
        const toggleButtons = document.querySelectorAll('[data-md-component="palette"]');
        
        toggleButtons.forEach(toggle => {
            const isActive = toggle.getAttribute('data-md-color-scheme') === currentTheme;
            toggle.setAttribute('aria-pressed', isActive.toString());
            
            // Update button styling
            if (isActive) {
                toggle.classList.add('md-typeset');
            } else {
                toggle.classList.remove('md-typeset');
            }
        });
    }

    /**
     * Initialize theme based on saved preference or system preference
     */
    function initializeTheme() {
        const savedTheme = getSavedTheme();
        
        if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
            // Use saved theme
            applyTheme(savedTheme, false);
        } else {
            // Use system preference as default
            const systemTheme = getSystemPreference();
            applyTheme(systemTheme, false);
            setSystemPreference(true);
        }
    }

    /**
     * Handle theme toggle clicks
     */
    function handleThemeToggle(event) {
        const button = event.currentTarget;
        const newTheme = button.getAttribute('data-md-color-scheme');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        // Only apply if different theme
        if (newTheme !== currentTheme) {
            applyTheme(newTheme, true);
            saveTheme(newTheme);
            setSystemPreference(false); // User explicitly chose a theme
            
            // Track theme change for analytics (if available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'theme_change', {
                    'theme': newTheme
                });
            }
        }
    }

    /**
     * Handle system preference changes
     */
    function handleSystemPreferenceChange(event) {
        if (prefersSystemTheme()) {
            const newTheme = event.matches ? THEMES.DARK : THEMES.LIGHT;
            applyTheme(newTheme, true);
            saveTheme(newTheme);
        }
    }

    /**
     * Add system preference toggle option
     */
    function addSystemPreferenceToggle() {
        const palette = document.querySelector('[data-md-component="palette"]');
        if (!palette) return;

        // Create system preference toggle
        const systemToggle = document.createElement('button');
        systemToggle.className = 'md-button md-button--primary';
        systemToggle.innerHTML = `
            <span class="twemoji">
                ${prefersSystemTheme() ? '🌙' : '☀️'}
            </span>
            Use System Theme
        `;
        
        systemToggle.addEventListener('click', () => {
            const systemPref = !prefersSystemTheme();
            setSystemPreference(systemPref);
            
            if (systemPref) {
                const systemTheme = getSystemPreference();
                applyTheme(systemTheme, true);
                saveTheme(systemTheme);
            }
            
            // Update button
            systemToggle.innerHTML = `
                <span class="twemoji">
                    ${systemPref ? '🌙' : '☀️'}
                </span>
                Use System Theme
            `;
        });

        // Insert after existing palette toggles
        const existingToggles = palette.querySelectorAll('.md-button');
        if (existingToggles.length > 0) {
            existingToggles[existingToggles.length - 1].after(systemToggle);
        } else {
            palette.appendChild(systemToggle);
        }
    }

    /**
     * Initialize theme persistence system
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(init, 100);
            });
            return;
        }

        // Initialize theme
        initializeTheme();

        // Add event listeners to theme toggle buttons
        const toggleButtons = document.querySelectorAll('[data-md-component="palette"] button');
        toggleButtons.forEach(button => {
            button.addEventListener('click', handleThemeToggle);
        });

        // Listen for system preference changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', handleSystemPreferenceChange);
        }

        // Add system preference toggle (optional enhancement)
        setTimeout(addSystemPreferenceToggle, 500);
    }

    // Initialize the theme system
    init();

    // Expose functions for external use
    window.themePersistence = {
        getTheme: () => document.documentElement.getAttribute('data-theme'),
        setTheme: (theme) => {
            if (Object.values(THEMES).includes(theme)) {
                applyTheme(theme, true);
                saveTheme(theme);
                setSystemPreference(false);
            }
        },
        toggleSystemPreference: () => {
            const systemPref = !prefersSystemTheme();
            setSystemPreference(systemPref);
            if (systemPref) {
                const systemTheme = getSystemPreference();
                applyTheme(systemTheme, true);
                saveTheme(systemTheme);
            }
        }
    };
})();
