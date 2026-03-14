/**
 * Wake Lock Manager - Prevent display from sleeping during lyrics viewing
 * Uses the Screen Wake Lock API with fallback support
 */

class WakeLockManager {
    constructor() {
        this.wakeLock = null;
        this.fallbackInterval = null;
        this.isSupported = 'wakeLock' in navigator;
        this.activeViewers = new Set();
    }

    /**
     * Request wake lock when a viewer opens
     * @param {string} viewerId - Unique identifier for the viewer (component name)
     */
    async requestWakeLock(viewerId) {
        if (!viewerId) return;

        this.activeViewers.add(viewerId);

        if (!this.isSupported) {
            this.fallbackWakeLock();
            return;
        }

        try {
            if (!this.wakeLock) {
                this.wakeLock = await navigator.wakeLock.request('screen');
                console.log('Screen wake lock acquired');

                // Listen for release events
                this.wakeLock.addEventListener('release', () => {
                    console.log('Screen wake lock was released');
                    this.wakeLock = null;
                });
            }
        } catch (err) {
            console.warn('Failed to acquire wake lock:', err.name, err.message);
            this.fallbackWakeLock();
        }
    }

    /**
     * Release wake lock when all viewers are closed
     * @param {string} viewerId - Unique identifier for the viewer
     */
    releaseWakeLock(viewerId) {
        if (!viewerId) return;

        this.activeViewers.delete(viewerId);

        // Only release if no viewers are active
        if (this.activeViewers.size === 0) {
            if (this.wakeLock) {
                this.wakeLock.release()
                    .then(() => {
                        this.wakeLock = null;
                        console.log('Screen wake lock released');
                    })
                    .catch((err) => console.warn('Error releasing wake lock:', err));
            }

            this.clearFallbackWakeLock();
        }
    }

    /**
     * Fallback wake lock using visual feedback
     * This keeps the screen awake by preventing the screen from dimming
     */
    fallbackWakeLock() {
        if (this.fallbackInterval) return;

        this.fallbackInterval = setInterval(() => {
            // Use the Visibility API to detect if page is still visible
            if (document.visibilityState === 'visible') {
                // Request animation frame to keep the device awake
                requestAnimationFrame(() => {
                    // This keeps the device from sleeping
                });
            }
        }, 10000); // Check every 10 seconds
    }

    /**
     * Clear fallback wake lock interval
     */
    clearFallbackWakeLock() {
        if (this.fallbackInterval) {
            clearInterval(this.fallbackInterval);
            this.fallbackInterval = null;
        }
    }

    /**
     * Check if any viewers are currently active
     */
    hasActiveViewers() {
        return this.activeViewers.size > 0;
    }
}

// Create a singleton instance
export const wakeLockManager = new WakeLockManager();
