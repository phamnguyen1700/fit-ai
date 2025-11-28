"use client";
import React, { useState } from "react";
import Header from "./components/header";
import FeedbackList from "./components/tabs/FeedbackList";
import ReviewFeedback from "./components/tabs/ReviewFeedback";
import PublicFeedback from "./components/tabs/PublicFeedback";

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState<string>("feedback-list");

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "feedback-list":
        return <FeedbackList />;
      case "review-feedback":
        return <ReviewFeedback />;
      case "public-feedback":
        return <PublicFeedback />;
      default:
        return <FeedbackList />;
    }
  };

  return (
    <div className="feedback-page">
      <Header activeTab={activeTab} onCategoryChange={handleTabChange} />
      <div className="feedback-page-content">{renderTabContent()}</div>
    </div>
  );
}
