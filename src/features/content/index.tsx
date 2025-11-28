"use client";
import React, { useState } from 'react'
import Header from './components/header'
import ExerciseTab from './components/tabs/ExerciseTab'
import ArchiveTab from './components/tabs/ArchiveTab'

export default function Content() {
  const [activeTab, setActiveTab] = useState('exercise');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'exercise':
        return <ExerciseTab />;
      case 'history':
        return <ArchiveTab />;
      default:
        return <ExerciseTab />;
    }
  };

  return (
    <div>
      <Header 
        activeTab={activeTab} 
        onTabChange={(key) => setActiveTab(key)} 
        onImportExport={() => console.log('Import/Export clicked')}
      />
      <div className="mt-4">
        {renderTabContent()}
      </div>
    </div>
  )
}
