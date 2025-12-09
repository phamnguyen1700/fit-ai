"use client";
import React, { useState } from 'react'
import Header from './components/header'
import ExerciseTab from './components/tabs/ExerciseTab'
import CategoryTab from './components/tabs/CategoryTab'

export default function Content() {
  const [activeTab, setActiveTab] = useState('exercise');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'exercise':
        return <ExerciseTab />;
      case 'history':
        return <CategoryTab />;
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
