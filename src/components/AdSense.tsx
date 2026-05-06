'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  layout?: string;
  layoutKey?: string;
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true, 
  className, 
  style,
  layout,
  layoutKey
}: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-expect-error AdSense script is loaded globally
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense initialization failed
    }
  }, []);

  return (
    <div className={className} key={adSlot}>
      <ins
        className="adsbygoogle"
        style={style || { display: 'block' }}
        data-ad-client="ca-pub-7772989208876183"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
      />
    </div>
  );
}
