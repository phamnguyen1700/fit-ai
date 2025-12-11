'use client';

import React from 'react';

interface HeaderBannerProps {
  title: string;
  ctaText?: string;
  onCtaClick?: () => void;
  onEditClick?: () => void;
  imageUrl: string;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  imageUrl,
}) => {
  return (  
      <div
        className="header-banner"
        style={{
          padding: '30px 36px',
          backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${imageUrl})`,
        }}
      >
      </div>
  );
};


