"use client";
import React, { useState } from 'react';
import Header from './components/header';
import AdminCard from './components/AdminCard';

interface SettingProps {
  className?: string;
}

export const SettingPage: React.FC<SettingProps> = ({ className = "" }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="setting-container">
        <Header 
          onEditClick={handleEditClick}
        />
        
        {/* Content */}
        <div className="mt-6">
          <div className="general-info-content">
            <AdminCard 
              isEditing={isEditing}
              onCancel={() => setIsEditing(false)}
              onSave={() => setIsEditing(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

