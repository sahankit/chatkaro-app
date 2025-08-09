import React, { useEffect } from 'react';

// Google Ads Component for easy integration
const GoogleAds = ({ 
  adSlot, 
  adFormat = 'auto', 
  adLayout = '', 
  adLayoutKey = '',
  style = {},
  className = ''
}) => {
  useEffect(() => {
    try {
      // Load Google Ads script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
        
        window.adsbygoogle = window.adsbygoogle || [];
      }
      
      // Push ad to Google Ads queue
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error loading Google Ads:', error);
    }
  }, []);

  return (
    <div className={`google-ads-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX" // Replace with your Google Ads client ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Pre-configured ad components for different positions
export const HeaderAd = () => (
  <GoogleAds 
    adSlot="1234567890" // Replace with your ad slot ID
    adFormat="auto"
    style={{ minHeight: '60px', minWidth: '300px' }}
    className="header-ad-component"
  />
);

export const SidebarAd = () => (
  <GoogleAds 
    adSlot="2345678901" // Replace with your ad slot ID
    adFormat="auto"
    style={{ minHeight: '120px' }}
    className="sidebar-ad-component"
  />
);

export const FooterAd = () => (
  <GoogleAds 
    adSlot="3456789012" // Replace with your ad slot ID
    adFormat="auto"
    style={{ minHeight: '100px', maxWidth: '728px' }}
    className="footer-ad-component"
  />
);

export default GoogleAds;
