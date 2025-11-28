'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LoginModal } from './LoginModal';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('#top');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navigation = [
    { name: 'Trang Chủ', href: '#top' },
    { name: 'Tính năng', href: '#features' },
    { name: 'Giá cả', href: '#pricing' },
    { name: 'Tải xuống', href: '#download' },
  ];

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      setActiveSection(href);
      if (href === '#top') {
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });
      } else {
        const element = document.getElementById(href.substring(1));
        if (element) {
          const headerHeight = 72; 
          const elementPosition = element.offsetTop - headerHeight;
          
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }
    } else {
      router.push(href);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      if (pathname !== '/home') return;
      
      const sections = ['features', 'pricing', 'download'];
      const headerHeight = 72;
      const scrollTop = window.scrollY + headerHeight + 100;
      
      if (window.scrollY < 100) {
        setActiveSection('#top');
        return;
      }
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          
          if (scrollTop >= elementTop && scrollTop < elementBottom) {
            setActiveSection(`#${sectionId}`);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'shadow-lg backdrop-blur-md border-b border-opacity-20' 
          : 'shadow-sm backdrop-blur-sm'
      }`}
      style={{
        background: isScrolled 
          ? 'var(--primay-extralight)' 
          : 'var(--primay-extralight)',
        borderColor: 'var(--primay-extralight)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center" style={{ height: '4.5rem' }}>
          {/* Logo */}
          <Link href="/home" className="flex flex-col items-start cursor-pointer group">
            <span
              className="text-base font-semibold tracking-tight leading-tight transition-all duration-300 group-hover:scale-105"
              style={{ color: 'var(--text)' }}
            >
              AI Planning
            </span>
            <span
              className="text-2xl font-black leading-tight -mt-0.5 transition-all duration-300 group-hover:scale-105"
              style={{ color: 'var(--primary)' }}
            >
              FIT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = pathname === '/home' ? activeSection === item.href : pathname === item.href;
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="relative group text-base font-medium transition-all duration-300"
                  style={{
                    color: isActive ? 'var(--primary)' : 'var(--text)',
                  }}
                >
                  <span className="relative inline-block">
                    {item.name}
                    {/* Animated underline */}
                    <div
                      className={`absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                      style={{ 
                        background: 'var(--primary)',
                      }}
                    ></div>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* User Login Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="relative group px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 overflow-hidden"
              style={{
                color: 'white',
                background: 'var(--primary)',
              }}
              aria-label="Đăng nhập"
            >
              {/* Background animation */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
                }}
              ></div>
              
              {/* Content */}
              <div className="relative flex items-center gap-2">
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
                <span>Đăng nhập</span>
              </div>

              {/* Hover border effect */}
              <div 
                className="absolute inset-0 rounded-lg border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  background: 'transparent',
                  pointerEvents: 'none'
                }}
              ></div>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-lg transition-all duration-200 hover:bg-opacity-20"
              style={{ 
                color: 'var(--text)',
                backgroundColor: 'rgba(var(--primary), 0.05)'
              }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  );
}