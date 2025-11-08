# SyncedAccessWebsite

Twitter automation userscripts for monitoring and refreshing profile content.

## Scripts

### Twitter Profile Auto Refresher (`twitter-profile-refresher.user.js`)
- Auto-refreshes the @clouramlearning profile page every 30 seconds
- Shows countdown indicator in top-right corner
- Prevents rate limiting with minimum 5-second intervals

### Twitter Link Monitor & Auto Refresher (`twitter-link-monitor.user.js`)
- Monitors links from @clouramlearning profile and tweets
- Opens external links in new tabs (maximum 5 tabs)
- Auto-refreshes opened tabs every 1 second
- Interactive control panel to start/stop monitoring
- Queue management for processing links

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click on each `.user.js` file in this repository
3. Click "Install" in the Tampermonkey popup
4. Visit https://x.com/clouramlearning or https://twitter.com/clouramlearning

## Usage

### Profile Refresher
- Starts automatically when visiting the profile page
- Blue indicator shows countdown to next refresh

### Link Monitor
1. Visit the profile page
2. Click "Start" in the blue control panel (top-right)
3. Script will automatically:
   - Find external links in tweets and profile bio
   - Open them in new tabs
   - Refresh opened tabs every second
4. Use "Close All Tabs" to stop monitoring and clean up

## Features

- **Targeted**: Only works on @clouramlearning profile pages
- **Safe**: Filters out Twitter internal links
- **Controlled**: Configurable tab limits and refresh intervals
- **Visual**: Clear status indicators and control panels
- **Automatic**: Hands-free operation once started

## Configuration

Edit the constants at the top of each script to customize:
- Refresh intervals
- Maximum tab limits
- Monitoring frequency

## Compatibility

- Works on Chrome, Firefox, Edge, and Safari with Tampermonkey
- Supports both twitter.com and x.com domains
- Compatible with modern Twitter/X interface

## License

MIT License - feel free to modify and distribute.