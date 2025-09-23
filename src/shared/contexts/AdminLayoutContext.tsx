'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminLayoutContextType {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  headerTitle: string;
  setHeaderTitle: (title: string) => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

export const AdminLayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showSearch, setShowSearch] = useState(true);
  const [headerTitle, setHeaderTitle] = useState("Create your workout goals");

  return (
    <AdminLayoutContext.Provider value={{
      showSearch,
      setShowSearch,
      headerTitle,
      setHeaderTitle
    }}>
      {children}
    </AdminLayoutContext.Provider>
  );
};

export const useAdminLayout = () => {
  const context = useContext(AdminLayoutContext);
  if (context === undefined) {
    throw new Error('useAdminLayout must be used within an AdminLayoutProvider');
  }
  return context;
};
