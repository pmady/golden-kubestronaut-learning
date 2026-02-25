/**
 * Theme Analytics and Usage Tracking
 * Tracks theme usage patterns and preferences for optimization
 */

(function() {
    'use strict';

    const ANALYTICS_KEY = 'theme-analytics';
    const ANALYTICS_VERSION = '1.0';

    /**
     * Get current analytics data
     */
    function getAnalyticsData() {
        try {
            const data = localStorage.getItem(ANALYTICS_KEY);
            return data ? JSON.parse(data) : {
                version: ANALYTICS_VERSION,
                created: new Date().toISOString(),
                sessions: [],
                currentSession: null
            };
        } catch (e) {
            console.warn('Unable to access analytics data:', e);
            return null;
        }
    }

    /**
     * Save analytics data
     */
    function saveAnalyticsData(data) {
        try {
            localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Unable to save analytics data:', e);
        }
    }

    /**
     * Start new session tracking
     */
    function startSession() {
        const data = getAnalyticsData();
        if (!data) return;

        const session = {
            id: Date.now().toString(),
            startTime: new Date().toISOString(),
            userAgent: navigator.userAgent,
            systemPreference: window.matchMedia('(prefers-color-scheme: dark)').matches,
            initialTheme: window.themePersistence ? window.themePersistence.getTheme() : 'unknown',
            themeChanges: [],
            duration: 0
        };

        data.currentSession = session;
        data.sessions.push(session);

        // Keep only last 30 sessions to prevent storage bloat
        if (data.sessions.length > 30) {
            data.sessions = data.sessions.slice(-30);
        }

        saveAnalyticsData(data);
    }

    /**
     * Track theme change
     */
    function trackThemeChange(fromTheme, toTheme, trigger) {
        const data = getAnalyticsData();
        if (!data || !data.currentSession) return;

        const change = {
            timestamp: new Date().toISOString(),
            from: fromTheme,
            to: toTheme,
            trigger: trigger, // 'manual', 'system', 'programmatic'
            systemPreferenceAtTime: window.matchMedia('(prefers-color-scheme: dark)').matches
        };

        data.currentSession.themeChanges.push(change);
        saveAnalyticsData(data);

        // Send to external analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                'event_category': 'theme',
                'from_theme': fromTheme,
                'to_theme': toTheme,
                'trigger': trigger
            });
        }
    }

    /**
     * End current session
     */
    function endSession() {
        const data = getAnalyticsData();
        if (!data || !data.currentSession) return;

        data.currentSession.endTime = new Date().toISOString();
        data.currentSession.duration = new Date(data.currentSession.endTime) - new Date(data.currentSession.startTime);
        data.currentSession = null;

        saveAnalyticsData(data);
    }

    /**
     * Get usage statistics
     */
    function getUsageStats() {
        const data = getAnalyticsData();
        if (!data) return null;

        const stats = {
            totalSessions: data.sessions.length,
            averageSessionDuration: 0,
            themeUsage: {},
            systemPreferenceUsage: { light: 0, dark: 0 },
            mostUsedTheme: 'unknown',
            themeChangeFrequency: 0
        };

        let totalDuration = 0;
        let totalThemeChanges = 0;

        data.sessions.forEach(session => {
            // Duration
            if (session.duration) {
                totalDuration += session.duration;
            }

            // System preference
            if (session.systemPreference) {
                stats.systemPreferenceUsage.dark++;
            } else {
                stats.systemPreferenceUsage.light++;
            }

            // Theme usage
            const themes = [session.initialTheme];
            session.themeChanges.forEach(change => {
                themes.push(change.to);
                totalThemeChanges++;
            });

            themes.forEach(theme => {
                stats.themeUsage[theme] = (stats.themeUsage[theme] || 0) + 1;
            });
        });

        stats.averageSessionDuration = totalDuration / data.sessions.length;
        stats.themeChangeFrequency = totalThemeChanges / data.sessions.length;

        // Find most used theme
        let maxUsage = 0;
        Object.entries(stats.themeUsage).forEach(([theme, usage]) => {
            if (usage > maxUsage) {
                maxUsage = usage;
                stats.mostUsedTheme = theme;
            }
        });

        return stats;
    }

    /**
     * Initialize analytics
     */
    function init() {
        // Wait for theme persistence to be available
        if (typeof window.themePersistence === 'undefined') {
            setTimeout(init, 100);
            return;
        }

        // Start session
        startSession();

        // Track theme changes
        const originalSetTheme = window.themePersistence.setTheme;
        window.themePersistence.setTheme = function(theme) {
            const currentTheme = this.getTheme();
            originalSetTheme.call(this, theme);
            trackThemeChange(currentTheme, theme, 'programmatic');
        };

        const originalToggleSystem = window.themePersistence.toggleSystemPreference;
        window.themePersistence.toggleSystemPreference = function() {
            const currentTheme = this.getTheme();
            originalToggleSystem.call(this);
            const newTheme = this.getTheme();
            trackThemeChange(currentTheme, newTheme, 'system');
        };

        // Track manual theme changes
        document.addEventListener('click', function(event) {
            const button = event.target.closest('[data-md-component="palette"] button');
            if (button) {
                const currentTheme = window.themePersistence.getTheme();
                setTimeout(() => {
                    const newTheme = window.themePersistence.getTheme();
                    if (currentTheme !== newTheme) {
                        trackThemeChange(currentTheme, newTheme, 'manual');
                    }
                }, 100);
            }
        });

        // End session on page unload
        window.addEventListener('beforeunload', endSession);

        // Expose analytics functions
        window.themeAnalytics = {
            getStats: getUsageStats,
            getRawData: getAnalyticsData,
            clearData: function() {
                try {
                    localStorage.removeItem(ANALYTICS_KEY);
                } catch (e) {
                    console.warn('Unable to clear analytics data:', e);
                }
            }
        };

        // Log stats to console for debugging
        console.log('Theme Analytics initialized');
        setTimeout(() => {
            const stats = getUsageStats();
            if (stats) {
                console.log('Theme Usage Stats:', stats);
            }
        }, 2000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
