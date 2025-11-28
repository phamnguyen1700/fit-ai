'use client';

import React from 'react';
import { Icon } from '@/shared/ui/icon';

interface HeaderBannerProps {
  title: string;
  ctaText?: string;
  onCtaClick?: () => void;
  onEditClick?: () => void;
  imageUrl: string;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  title,
  ctaText = 'Create',
  onCtaClick,
  onEditClick,
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
        <div className="header-banner_content">
          <div>
            <h3 className="header-banner_title">{title}</h3>
            {ctaText && (
              <button className="header-banner_cta" onClick={onCtaClick}>
                {ctaText}
              </button>
            )}
          </div>
          {onEditClick && (
            <button className="header-banner_edit" onClick={onEditClick} aria-label="edit">
              <Icon name="mdi:pencil-outline" />
            </button>
          )}
        </div>
      </div>
  );
};


