// ==UserScript==
// @name         Twitter Profile Auto Refresher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-refreshes Twitter profile page for clouramlearning
// @author       You
// @match        https://x.com/clouramlearning
// @match        https://twitter.com/clouramlearning
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Configuration
    const REFRESH_INTERVAL = 30000; // 30 seconds in milliseconds
    const MIN_INTERVAL = 5000; // Minimum 5 seconds to avoid rate limiting
    
    // Validate refresh interval
    const refreshInterval = Math.max(REFRESH_INTERVAL, MIN_INTERVAL);
    
    console.log(`Twitter Profile Auto Refresher started for clouramlearning`);
    console.log(`Refreshing every ${refreshInterval / 1000} seconds`);
    
    // Function to refresh the page
    function refreshPage() {
        console.log('Refreshing page...');
        window.location.reload();
    }
    
    // Set up the refresh interval
    const refreshTimer = setInterval(refreshPage, refreshInterval);
    
    // Optional: Add a visual indicator
    function addRefreshIndicator() {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(29, 161, 242, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        indicator.textContent = `Auto-refresh: ${refreshInterval / 1000}s`;
        document.body.appendChild(indicator);
        
        // Update countdown
        let countdown = refreshInterval / 1000;
        setInterval(() => {
            countdown--;
            if (countdown <= 0) countdown = refreshInterval / 1000;
            indicator.textContent = `Auto-refresh: ${countdown}s`;
        }, 1000);
    }
    
    // Wait for page to load before adding indicator
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addRefreshIndicator);
    } else {
        addRefreshIndicator();
    }
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(refreshTimer);
    });
    
})();