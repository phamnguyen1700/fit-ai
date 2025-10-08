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
    <header
      className="border-b"
      style={{
        background: 'var(--primay-extralight)',
        borderColor: 'var(--primay-extralight)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center" style={{ height: '4.5rem' }}>
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="flex flex-col items-start">
              <span
                className="text-xl font-bold leading-tight"
                style={{ color: 'var(--text)' }}
              >
                AI Planning
              </span>
              <span
                className="text-3xl font-bold leading-tight -mt-1"
                style={{ color: 'var(--primary)' }}
              >
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
                className={
                  'text-base font-semibold transition-colors relative pb-1'
                }
                style={{
                  color:
                    pathname === item.href
                      ? 'var(--primary)'
                      : 'var(--text)',
                }}
              >
                {item.name}
                {pathname === item.href && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'var(--primary)' }}
                  ></div>
                )}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => router.push('/download')}
              className="px-8 py-3 rounded-lg text-base font-bold transition-colors"
              style={{
                background: 'var(--primary)',
                color: 'var(--text-inverse)',
              }}
            >
              Tải app ngay
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="p-2"
              style={{ color: 'var(--text)' }}
            >
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
