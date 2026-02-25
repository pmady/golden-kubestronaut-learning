/**
 * Advanced Theme Manager
 * Provides multiple theme variants, time-based switching, and customization options
 */

(function() {
    'use strict';

    const THEME_VARIANTS = {
        DEFAULT: 'default',
        BLUE: 'blue',
        GREEN: 'green',
        PURPLE: 'purple'
    };

    const STORAGE_KEYS = {
        THEME_VARIANT: 'theme-variant',
        TIME_BASED: 'time-based-theme',
        CUSTOM_COLORS: 'custom-theme-colors',
        AUTO_SWITCH: 'auto-theme-switch'
    };

    /**
     * Advanced Theme Manager Class
     */
    class AdvancedThemeManager {
        constructor() {
            this.currentVariant = THEME_VARIANTS.DEFAULT;
            this.timeBasedEnabled = false;
            this.customColors = {};
            this.autoSwitchEnabled = false;
            this.init();
        }

        /**
         * Initialize the advanced theme manager
         */
        init() {
            this.loadSettings();
            this.setupTimeBasedSwitching();
            this.setupCustomizationPanel();
            this.setupVariantSwitcher();
            this.applyCurrentVariant();
        }

        /**
         * Load saved settings
         */
        loadSettings() {
            try {
                this.currentVariant = localStorage.getItem(STORAGE_KEYS.THEME_VARIANT) || THEME_VARIANTS.DEFAULT;
                this.timeBasedEnabled = localStorage.getItem(STORAGE_KEYS.TIME_BASED) === 'true';
                this.customColors = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_COLORS) || '{}');
                this.autoSwitchEnabled = localStorage.getItem(STORAGE_KEYS.AUTO_SWITCH) === 'true';
            } catch (e) {
                console.warn('Unable to load theme settings:', e);
            }
        }

        /**
         * Save settings
         */
        saveSettings() {
            try {
                localStorage.setItem(STORAGE_KEYS.THEME_VARIANT, this.currentVariant);
                localStorage.setItem(STORAGE_KEYS.TIME_BASED, this.timeBasedEnabled.toString());
                localStorage.setItem(STORAGE_KEYS.CUSTOM_COLORS, JSON.stringify(this.customColors));
                localStorage.setItem(STORAGE_KEYS.AUTO_SWITCH, this.autoSwitchEnabled.toString());
            } catch (e) {
                console.warn('Unable to save theme settings:', e);
            }
        }

        /**
         * Apply current theme variant
         */
        applyCurrentVariant() {
            const body = document.body;
            
            // Remove all variant classes
            Object.values(THEME_VARIANTS).forEach(variant => {
                body.classList.remove(`theme-variant-${variant}`);
            });

            // Add current variant class
            if (this.currentVariant !== THEME_VARIANTS.DEFAULT) {
                body.classList.add(`theme-variant-${this.currentVariant}`);
            }

            // Apply custom colors
            this.applyCustomColors();
        }

        /**
         * Apply custom colors
         */
        applyCustomColors() {
            const root = document.documentElement;
            Object.entries(this.customColors).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
        }

        /**
         * Set theme variant
         */
        setVariant(variant) {
            if (Object.values(THEME_VARIANTS).includes(variant)) {
                this.currentVariant = variant;
                this.applyCurrentVariant();
                this.saveSettings();
                this.trackThemeChange('variant', variant);
            }
        }

        /**
         * Setup time-based theme switching
         */
        setupTimeBasedSwitching() {
            if (this.timeBasedEnabled) {
                this.updateTimeBasedTheme();
                // Update every minute
                setInterval(() => this.updateTimeBasedTheme(), 60000);
            }
        }

        /**
         * Update theme based on time
         */
        updateTimeBasedTheme() {
            if (!this.timeBasedEnabled) return;

            const hour = new Date().getHours();
            const isDarkTime = hour >= 18 || hour < 6; // 6 PM to 6 AM

            if (window.themePersistence) {
                const targetTheme = isDarkTime ? 'slate' : 'default';
                const currentTheme = window.themePersistence.getTheme();
                
                if (currentTheme !== targetTheme) {
                    window.themePersistence.setTheme(targetTheme);
                    this.showTimeBasedNotification(isDarkTime);
                }
            }
        }

        /**
         * Show time-based theme notification
         */
        showTimeBasedNotification(isDarkTime) {
            const message = isDarkTime ? 
                '🌙 Auto-switched to dark mode (evening)' : 
                '☀️ Auto-switched to light mode (morning)';
            
            this.showNotification(message, 3000);
        }

        /**
         * Enable/disable time-based switching
         */
        toggleTimeBased() {
            this.timeBasedEnabled = !this.timeBasedEnabled;
            this.saveSettings();
            this.setupTimeBasedSwitching();
            
            const message = this.timeBasedEnabled ? 
                '⏰ Time-based theme switching enabled' : 
                '⏰ Time-based theme switching disabled';
            
            this.showNotification(message, 2000);
        }

        /**
         * Setup customization panel
         */
        setupCustomizationPanel() {
            this.createCustomizationPanel();
            this.setupPanelToggle();
        }

        /**
         * Create customization panel
         */
        createCustomizationPanel() {
            const panel = document.createElement('div');
            panel.className = 'theme-customization-panel';
            panel.innerHTML = `
                <div class="theme-customization-header">
                    <h3>Theme Customization</h3>
                    <button class="panel-close" aria-label="Close panel">×</button>
                </div>
                <div class="theme-customization-content">
                    <div class="theme-control-group">
                        <label class="theme-control-label">Theme Variant</label>
                        <select class="theme-control-input" id="theme-variant-select">
                            <option value="default">Default</option>
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="purple">Purple</option>
                        </select>
                    </div>
                    
                    <div class="theme-control-group">
                        <label class="theme-control-label">
                            <input type="checkbox" id="time-based-toggle"> 
                            Time-based switching
                        </label>
                        <small class="time-based-theme">
                            Automatically switch between light/dark based on time of day
                        </small>
                    </div>
                    
                    <div class="theme-control-group">
                        <label class="theme-control-label">
                            <input type="checkbox" id="auto-switch-toggle"> 
                            Auto-variant switching
                        </label>
                        <small>
                            Automatically cycle through variants
                        </small>
                    </div>
                    
                    <div class="theme-control-group">
                        <label class="theme-control-label">Primary Color</label>
                        <input type="color" class="theme-control-input" id="primary-color" value="#6366f1">
                    </div>
                    
                    <div class="theme-control-group">
                        <label class="theme-control-label">Accent Color</label>
                        <input type="color" class="theme-control-input" id="accent-color" value="#8b5cf6">
                    </div>
                    
                    <div class="theme-control-group">
                        <button class="md-button md-button--primary" id="reset-theme">
                            Reset to Default
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);
            this.setupPanelControls(panel);
        }

        /**
         * Setup panel controls
         */
        setupPanelControls(panel) {
            // Variant selector
            const variantSelect = panel.querySelector('#theme-variant-select');
            variantSelect.value = this.currentVariant;
            variantSelect.addEventListener('change', (e) => {
                this.setVariant(e.target.value);
            });

            // Time-based toggle
            const timeBasedToggle = panel.querySelector('#time-based-toggle');
            timeBasedToggle.checked = this.timeBasedEnabled;
            timeBasedToggle.addEventListener('change', () => {
                this.toggleTimeBased();
            });

            // Auto-switch toggle
            const autoSwitchToggle = panel.querySelector('#auto-switch-toggle');
            autoSwitchToggle.checked = this.autoSwitchEnabled;
            autoSwitchToggle.addEventListener('change', (e) => {
                this.autoSwitchEnabled = e.target.checked;
                this.saveSettings();
                if (this.autoSwitchEnabled) {
                    this.startAutoVariantSwitching();
                } else {
                    this.stopAutoVariantSwitching();
                }
            });

            // Color pickers
            const primaryColor = panel.querySelector('#primary-color');
            const accentColor = panel.querySelector('#accent-color');
            
            primaryColor.addEventListener('change', (e) => {
                this.setCustomColor('--md-primary-fg-color', e.target.value);
            });

            accentColor.addEventListener('change', (e) => {
                this.setCustomColor('--md-accent-fg-color', e.target.value);
            });

            // Reset button
            const resetButton = panel.querySelector('#reset-theme');
            resetButton.addEventListener('click', () => {
                this.resetToDefault();
            });

            // Close button
            const closeButton = panel.querySelector('.panel-close');
            closeButton.addEventListener('click', () => {
                this.closePanel();
            });
        }

        /**
         * Setup panel toggle
         */
        setupPanelToggle() {
            const toggle = document.createElement('button');
            toggle.className = 'theme-customization-toggle';
            toggle.innerHTML = '🎨';
            toggle.setAttribute('aria-label', 'Open theme customization');
            toggle.style.cssText = `
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--md-primary-fg-color);
                color: white;
                border: none;
                cursor: pointer;
                font-size: 20px;
                z-index: 999;
                transition: all 0.3s ease;
            `;

            toggle.addEventListener('click', () => {
                this.togglePanel();
            });

            document.body.appendChild(toggle);
        }

        /**
         * Toggle customization panel
         */
        togglePanel() {
            const panel = document.querySelector('.theme-customization-panel');
            if (panel) {
                panel.classList.toggle('open');
            }
        }

        /**
         * Close panel
         */
        closePanel() {
            const panel = document.querySelector('.theme-customization-panel');
            if (panel) {
                panel.classList.remove('open');
            }
        }

        /**
         * Setup variant switcher
         */
        setupVariantSwitcher() {
            const switcher = document.createElement('div');
            switcher.className = 'theme-switcher-dropdown';
            switcher.innerHTML = `
                <button class="md-button theme-switcher-toggle">
                    Themes ▼
                </button>
                <div class="theme-switcher-content">
                    <div class="theme-option active" data-variant="default">
                        <div class="theme-preview">
                            <div class="theme-preview-color" style="background: #6366f1;"></div>
                            <span>Default</span>
                        </div>
                    </div>
                    <div class="theme-option" data-variant="blue">
                        <div class="theme-preview">
                            <div class="theme-preview-color" style="background: #3b82f6;"></div>
                            <span>Blue</span>
                        </div>
                    </div>
                    <div class="theme-option" data-variant="green">
                        <div class="theme-preview">
                            <div class="theme-preview-color" style="background: #22c55e;"></div>
                            <span>Green</span>
                        </div>
                    </div>
                    <div class="theme-option" data-variant="purple">
                        <div class="theme-preview">
                            <div class="theme-preview-color" style="background: #a855f7;"></div>
                            <span>Purple</span>
                        </div>
                    </div>
                </div>
            `;

            // Add to header
            const header = document.querySelector('.md-header');
            if (header) {
                header.appendChild(switcher);
            }

            this.setupVariantSwitcherEvents(switcher);
        }

        /**
         * Setup variant switcher events
         */
        setupVariantSwitcherEvents(switcher) {
            const toggle = switcher.querySelector('.theme-switcher-toggle');
            const content = switcher.querySelector('.theme-switcher-content');
            const options = switcher.querySelectorAll('.theme-option');

            // Toggle dropdown
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                content.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                content.classList.remove('show');
            });

            // Handle variant selection
            options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const variant = option.dataset.variant;
                    this.setVariant(variant);
                    
                    // Update active state
                    options.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                    
                    content.classList.remove('show');
                });
            });

            // Set initial active state
            const activeOption = switcher.querySelector(`[data-variant="${this.currentVariant}"]`);
            if (activeOption) {
                activeOption.classList.add('active');
            }
        }

        /**
         * Set custom color
         */
        setCustomColor(property, value) {
            this.customColors[property] = value;
            this.applyCustomColors();
            this.saveSettings();
        }

        /**
         * Start auto variant switching
         */
        startAutoVariantSwitching() {
            const variants = Object.values(THEME_VARIANTS);
            let currentIndex = variants.indexOf(this.currentVariant);
            
            this.autoSwitchInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % variants.length;
                this.setVariant(variants[currentIndex]);
            }, 30000); // Switch every 30 seconds
        }

        /**
         * Stop auto variant switching
         */
        stopAutoVariantSwitching() {
            if (this.autoSwitchInterval) {
                clearInterval(this.autoSwitchInterval);
                this.autoSwitchInterval = null;
            }
        }

        /**
         * Reset to default settings
         */
        resetToDefault() {
            this.currentVariant = THEME_VARIANTS.DEFAULT;
            this.timeBasedEnabled = false;
            this.customColors = {};
            this.autoSwitchEnabled = false;
            
            this.stopAutoVariantSwitching();
            this.applyCurrentVariant();
            this.saveSettings();
            
            // Update UI
            const variantSelect = document.querySelector('#theme-variant-select');
            if (variantSelect) variantSelect.value = THEME_VARIANTS.DEFAULT;
            
            const timeBasedToggle = document.querySelector('#time-based-toggle');
            if (timeBasedToggle) timeBasedToggle.checked = false;
            
            const autoSwitchToggle = document.querySelector('#auto-switch-toggle');
            if (autoSwitchToggle) autoSwitchToggle.checked = false;
            
            this.showNotification('Theme reset to default', 2000);
        }

        /**
         * Show notification
         */
        showNotification(message, duration = 3000) {
            const notification = document.createElement('div');
            notification.className = 'theme-notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--md-primary-fg-color);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 10000;
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.3s ease;
                max-width: 300px;
            `;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            }, 100);

            // Remove after duration
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, duration);
        }

        /**
         * Track theme change for analytics
         */
        trackThemeChange(type, value) {
            if (window.themeAnalytics) {
                // This would integrate with the analytics system
                console.log(`Theme ${type} changed to: ${value}`);
            }
        }
    }

    // Initialize when DOM is ready
    function init() {
        // Wait for basic theme persistence to be available
        if (typeof window.themePersistence === 'undefined') {
            setTimeout(init, 100);
            return;
        }

        // Initialize advanced theme manager
        window.advancedThemeManager = new AdvancedThemeManager();
        console.log('Advanced Theme Manager initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
