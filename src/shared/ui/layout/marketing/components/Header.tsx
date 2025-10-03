'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    { name: 'Trang Chủ', href: '/home' },
    { name: 'Tính năng', href: '/features' },
    { name: 'Giá cả', href: '/pricing' },
    { name: 'Tải xuống', href: '/download' },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <header className="bg-orange-50 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="flex flex-col items-start">
              <span className="text-xl font-bold text-gray-900 leading-tight">
                AI Planning
              </span>
              <span className="text-3xl font-bold text-orange-500 leading-tight -mt-1">
                FIT
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`text-base font-semibold transition-colors relative pb-1 ${
                  pathname === item.href
                    ? 'text-orange-500'
                    : 'text-gray-700 hover:text-orange-500'
                }`}
              >
                {item.name}
                {pathname === item.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => router.push('/download')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-base font-bold transition-colors"
            >
              Tải app ngay
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-orange-500 p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
