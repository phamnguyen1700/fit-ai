'use client';

import { useEffect } from 'react';
import Content from "@/features/content";
import { useAdminLayout } from '@/shared/contexts/AdminLayoutContext';

export default function AdminContentPage() {
  const { setShowSearch, setHeaderTitle } = useAdminLayout();

  useEffect(() => {
    // Ẩn search trong trang content
    setShowSearch(false);
    setHeaderTitle("Content Management");
    
    // Cleanup khi rời khỏi trang
    return () => {
      setShowSearch(true);
      setHeaderTitle("Create your workout goals");
    };
  }, [setShowSearch, setHeaderTitle]);

  return (
    <div>
      <Content />
    </div>
  );
}