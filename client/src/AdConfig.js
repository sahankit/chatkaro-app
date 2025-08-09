// Google Ads Configuration
// Replace these values with your actual Google Ads account details

export const GOOGLE_ADS_CONFIG = {
  // Your Google Ads Client ID (replace with your actual client ID)
  CLIENT_ID: 'ca-pub-XXXXXXXXXXXXXXXXX',
  
  // Ad Slot IDs for different positions (replace with your actual slot IDs)
  AD_SLOTS: {
    HEADER_BANNER: '1234567890',
    SIDEBAR_TOP: '2345678901', 
    SIDEBAR_BOTTOM: '3456789012',
    USERS_SIDEBAR: '4567890123',
    FOOTER_BANNER: '5678901234',
    MOBILE_BANNER: '6789012345'
  },
  
  // Ad Formats
  FORMATS: {
    BANNER: 'horizontal',
    RECTANGLE: 'rectangle',
    AUTO: 'auto',
    RESPONSIVE: 'autorelaxed'
  }
};

// Instructions for setting up Google Ads:
/*
1. Sign up for Google AdSense at https://www.google.com/adsense/
2. Add your website domain and get approved
3. Create ad units for each position:
   - Header Banner (728x90 or responsive)
   - Sidebar Ads (300x250 or responsive)
   - Footer Banner (728x90 or responsive)
4. Replace the CLIENT_ID and AD_SLOTS values above with your actual IDs
5. Update the data-ad-client and data-ad-slot values in GoogleAds.js
6. Test your ads in production environment
*/
