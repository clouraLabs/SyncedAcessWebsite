// ==UserScript==
// @name         Twitter Link Monitor & Auto Refresher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Monitors links from Twitter profile and opens/refreshes them in sequence
// @author       You
// @match        https://x.com/clouramlearning
// @match        https://twitter.com/clouramlearning
// @grant        window.open
// ==/UserScript==

(function() {
    'use strict';
    
    // Configuration
    const LINK_REFRESH_INTERVAL = 1000; // 1 second between link refreshes
    const MONITOR_INTERVAL = 5000; // Check for new links every 5 seconds
    const MAX_TABS = 5; // Maximum number of tabs to open
    
    let linkQueue = [];
    let currentTabIndex = 0;
    let openedTabs = [];
    let isMonitoring = false;
    
    console.log('Twitter Link Monitor & Auto Refresher started');
    
    // Function to extract links from the profile
    function extractLinks() {
        const links = [];
        
        // Get links from tweets
        const tweetLinks = document.querySelectorAll('a[href*="http"]');
        tweetLinks.forEach(link => {
            const href = link.href;
            // Filter out Twitter internal links
            if (!href.includes('x.com/') && !href.includes('twitter.com/') && 
                !href.includes('status') && !href.includes('retweet') &&
                !links.includes(href)) {
                links.push(href);
            }
        });
        
        // Get links from profile bio if exists
        const bioLinks = document.querySelectorAll('[data-testid="UserProfileHeader_Items"] a[href*="http"]');
        bioLinks.forEach(link => {
            const href = link.href;
            if (!href.includes('x.com/') && !href.includes('twitter.com/') && 
                !links.includes(href)) {
                links.push(href);
            }
        });
        
        return links;
    }
    
    // Function to open a link in a new tab
    function openLinkInTab(url) {
        try {
            const newTab = window.open(url, '_blank');
            if (newTab) {
                openedTabs.push({ tab: newTab, url: url, lastRefresh: Date.now() });
                console.log(`Opened link: ${url}`);
                return true;
            }
        } catch (error) {
            console.error(`Failed to open link: ${url}`, error);
        }
        return false;
    }
    
    // Function to refresh opened tabs
    function refreshTabs() {
        openedTabs.forEach((tabInfo, index) => {
            try {
                if (tabInfo.tab && !tabInfo.tab.closed) {
                    tabInfo.tab.location.reload();
                    tabInfo.lastRefresh = Date.now();
                    console.log(`Refreshed tab ${index + 1}: ${tabInfo.url}`);
                }
            } catch (error) {
                console.error(`Failed to refresh tab ${index + 1}:`, error);
            }
        });
    }
    
    // Function to close old tabs
    function closeOldTabs() {
        openedTabs = openedTabs.filter(tabInfo => {
            try {
                return tabInfo.tab && !tabInfo.tab.closed;
            } catch (error) {
                return false;
            }
        });
    }
    
    // Function to monitor and process links
    function monitorLinks() {
        const newLinks = extractLinks();
        
        // Add new links to queue
        newLinks.forEach(link => {
            if (!linkQueue.includes(link)) {
                linkQueue.push(link);
                console.log(`Found new link: ${link}`);
            }
        });
        
        // Process queue if we have capacity
        while (linkQueue.length > 0 && openedTabs.length < MAX_TABS) {
            const link = linkQueue.shift();
            openLinkInTab(link);
        }
        
        // Refresh existing tabs
        if (openedTabs.length > 0) {
            refreshTabs();
        }
        
        // Clean up closed tabs
        closeOldTabs();
    }
    
    // Function to add control panel
    function addControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'link-monitor-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(29, 161, 242, 0.95);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-size: 12px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            min-width: 200px;
        `;
        
        panel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">Link Monitor</div>
            <div>Queue: <span id="queue-count">0</span></div>
            <div>Tabs: <span id="tabs-count">0</span></div>
            <div>Status: <span id="status">Stopped</span></div>
            <button id="toggle-monitor" style="
                margin-top: 10px;
                padding: 5px 10px;
                background: white;
                color: #1DA1F2;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
            ">Start</button>
            <button id="clear-tabs" style="
                margin-top: 5px;
                padding: 5px 10px;
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                width: 100%;
            ">Close All Tabs</button>
        `;
        
        document.body.appendChild(panel);
        
        // Update panel info
        function updatePanel() {
            document.getElementById('queue-count').textContent = linkQueue.length;
            document.getElementById('tabs-count').textContent = openedTabs.length;
            document.getElementById('status').textContent = isMonitoring ? 'Running' : 'Stopped';
        }
        
        // Toggle monitoring
        document.getElementById('toggle-monitor').addEventListener('click', function() {
            isMonitoring = !isMonitoring;
            this.textContent = isMonitoring ? 'Stop' : 'Start';
            this.style.background = isMonitoring ? '#ff4444' : 'white';
            this.style.color = isMonitoring ? 'white' : '#1DA1F2';
            updatePanel();
        });
        
        // Clear all tabs
        document.getElementById('clear-tabs').addEventListener('click', function() {
            openedTabs.forEach(tabInfo => {
                try {
                    if (tabInfo.tab && !tabInfo.tab.closed) {
                        tabInfo.tab.close();
                    }
                } catch (error) {
                    console.error('Error closing tab:', error);
                }
            });
            openedTabs = [];
            linkQueue = [];
            updatePanel();
        });
        
        // Update panel periodically
        setInterval(updatePanel, 1000);
    }
    
    // Initialize
    function init() {
        addControlPanel();
        
        // Start monitoring links
        setInterval(() => {
            if (isMonitoring) {
                monitorLinks();
            }
        }, MONITOR_INTERVAL);
        
        // Start refresh cycle for opened tabs
        setInterval(() => {
            if (isMonitoring && openedTabs.length > 0) {
                refreshTabs();
            }
        }, LINK_REFRESH_INTERVAL);
    }
    
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();