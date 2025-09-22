"use client";
import React, { useState } from 'react'
import Header from './components/header'
import ExerciseTab from './components/tabs/ExerciseTab'
import NutritionTab from './components/tabs/NutritionTab'
import ArchiveTab from './components/tabs/ArchiveTab'

export default function Content() {
  const [activeTab, setActiveTab] = useState('exercise');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'exercise':
        return <ExerciseTab />;
      case 'nutrition':
        return <NutritionTab />;
      case 'archive':
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
        onSearch={(value) => console.log('Search:', value)}
        onAddNew={() => console.log('Add new clicked')}
        onEdit={() => console.log('Edit clicked')}
      />
      <div className="mt-4">
        {renderTabContent()}
      </div>
    </div>
  )
}
