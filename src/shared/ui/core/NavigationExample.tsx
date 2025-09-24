import React from 'react';
import { Navigation } from '@/shared/ui';

export default function NavigationExample() {
  const navigationItems = [
    {
      title: "Trang chủ",
      href: "/",
      icon: "mdi:home"
    },
    {
      title: "Quản lý",
      href: "/admin",
      icon: "mdi:cog"
    },
    {
      title: "Nội dung",
      href: "/admin/content",
      icon: "mdi:file-document"
    },
    {
      title: "Bài tập",
      // Current page - no href
      icon: "mdi:dumbbell"
    }
  ];

  const simpleNavigation = [
    {
      title: "Dashboard",
      onClick: () => console.log('Navigate to dashboard')
    },
    {
      title: "Users",
      onClick: () => console.log('Navigate to users')
    },
    {
      title: "Profile"
      // Current page
    }
  ];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-8">Navigation Component Examples</h1>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">With Icons and Links</h2>
        <Navigation 
          items={navigationItems}
          separator=">"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Simple Navigation with Clicks</h2>
        <Navigation 
          items={simpleNavigation}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Custom Separator</h2>
        <Navigation 
          items={navigationItems}
          separator="•"
        />
      </div>
    </div>
  );
}
