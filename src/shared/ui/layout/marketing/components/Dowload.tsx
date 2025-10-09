'use client';

import React from 'react';

interface DownloadOptionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonColor: string;
  onDownload: () => void;
}

const DownloadOption: React.FC<DownloadOptionProps> = ({
  icon,
  title,
  subtitle,
  buttonText,
  buttonColor,
  onDownload
}) => (
  <div className="bg-gray-100 rounded-2xl p-6 mb-6 ">
    <div className="flex items-center mb-4">
      <div className="mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
    </div>
    
    <button
      onClick={onDownload}
      className="w-full py-3 px-6 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90"
      style={{ backgroundColor: buttonColor }}
    >
      {buttonText}
    </button>
  </div>
);

const Download: React.FC = () => {
  const handleIOSDownload = () => {
    // Handle iOS App Store download
    console.log('Download from App Store');
  };

  const handleAndroidDownload = () => {
    // Handle Google Play download
    console.log('Download from Google Play');
  };

  const handleWebAppOpen = () => {
    // Handle Web App opening
    console.log('Open Web App');
  };

  return (
<div className="w-full ml-0 p-0">

      {/* iOS Option */}
      <DownloadOption
        icon={
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>
        }
        title="iOS"
        subtitle="Tải cho iPhone và iPad"
        buttonText="Tải từ App Store"
        buttonColor="#2d2d2d"
        onDownload={handleIOSDownload}
      />

      {/* Android Option */}
      <DownloadOption
        icon={
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396"/>
            </svg>
          </div>
        }
        title="Android"
        subtitle="Tải xuống cho điện thoại Android"
        buttonText="Tải từ Google Play"
        buttonColor="#4CAF50"
        onDownload={handleAndroidDownload}
      />

      {/* Web App Option */}
      <DownloadOption
        icon={
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
        }
        title="Web App"
        subtitle="Sử dụng trên trình duyệt"
        buttonText="Mở trên Web"
        buttonColor="#2196F3"
        onDownload={handleWebAppOpen}
      />
    </div>
  );
};

export default Download;