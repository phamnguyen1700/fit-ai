"use client";
import React, { useState } from "react";
import { Modal, Button, Progress } from "@/shared/ui";
import { Icon } from "@/shared/ui/icon";

export interface PopupExportProps {
  isOpen: boolean;
  onClose: () => void;
  onExport?: (dataType: string, dateRange: { from: Date | null; to: Date | null }, fileFormat: string) => void;
  className?: string;
}

type ExportState = 'initial' | 'exporting' | 'success';

export const PopupExport: React.FC<PopupExportProps> = ({
  isOpen,
  onClose,
  onExport,
  className,
}) => {
  const [exportState, setExportState] = useState<ExportState>('initial');
  const [selectedDataType, setSelectedDataType] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [fileFormat, setFileFormat] = useState<string>('xlsx');
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedFileName, setExportedFileName] = useState<string>('');

  const handleCancel = () => {
    if (exportState === 'exporting') {
      return; // Don't allow cancel during export
    }
    
    setExportState('initial');
    setSelectedDataType('');
    setDateFrom(null);
    setDateTo(null);
    setFileFormat('xlsx');
    setExportProgress(0);
    setExportedFileName('');
    onClose();
  };

  const handleExport = () => {
    if (!selectedDataType) {
      alert('Vui lòng chọn loại dữ liệu');
      return;
    }

    setExportState('exporting');
    setExportProgress(0);

    const fileName = `dinhduong_sep_2025.${fileFormat}`;
    setExportedFileName(fileName);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setExportState('success');
          }, 300);
          return 100;
        }
        return prev + Math.random() * 15; // Random progress increment
      });
    }, 200);

    // Call the onExport callback
    onExport?.(selectedDataType, { from: dateFrom, to: dateTo }, fileFormat);
  };

  const handleOK = () => {
    setExportState('initial');
    setSelectedDataType('');
    setDateFrom(null);
    setDateTo(null);
    setFileFormat('xlsx');
    setExportProgress(0);
    setExportedFileName('');
    onClose();
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('vi-VN') + ' - ' + 
           date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const renderInitialState = () => (
    <>
      {/* Data Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--text)] mb-2">
          Loại dữ liệu
        </label>
        <div className="relative">
          <select
            value={selectedDataType}
            onChange={(e) => setSelectedDataType(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent appearance-none"
            style={{ 
              backgroundColor: 'var(--bg)',
              borderColor: 'var(--border)',
              color: 'var(--text)'
            }}
          >
            <option value="">Chọn loại dữ liệu</option>
            <option value="nutrition">Dữ liệu dinh dưỡng</option>
            <option value="exercise">Dữ liệu tập luyện</option>
            <option value="users">Dữ liệu người dùng</option>
          </select>
          <Icon 
            name="mdi:chevron-down" 
            size={20} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            color="var(--text-tertiary)"
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            Từ ngày
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateFrom ? dateFrom.toISOString().split('T')[0] : ''}
              onChange={(e) => setDateFrom(e.target.value ? new Date(e.target.value) : null)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              style={{ 
                backgroundColor: 'var(--bg)',
                borderColor: 'var(--border)',
                color: 'var(--text)'
              }}
              placeholder="Ngày bắt đầu"
            />
            <Icon 
              name="mdi:calendar" 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              color="var(--text-tertiary)"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            Đến ngày
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateTo ? dateTo.toISOString().split('T')[0] : ''}
              onChange={(e) => setDateTo(e.target.value ? new Date(e.target.value) : null)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              style={{ 
                backgroundColor: 'var(--bg)',
                borderColor: 'var(--border)',
                color: 'var(--text)'
              }}
              placeholder="Đến ngày"
            />
            <Icon 
              name="mdi:calendar" 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              color="var(--text-tertiary)"
            />
          </div>
        </div>
      </div>

      {/* File Format Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--text)] mb-2">
          Định dạng file
        </label>
        <div className="relative">
          <select
            value={fileFormat}
            onChange={(e) => setFileFormat(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent appearance-none"
            style={{ 
              backgroundColor: 'var(--bg)',
              borderColor: 'var(--border)',
              color: 'var(--text)'
            }}
          >
            <option value="xlsx">.xlsx</option>
            <option value="csv">.csv</option>
          </select>
          <Icon 
            name="mdi:chevron-down" 
            size={20} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            color="var(--text-tertiary)"
          />
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>.xlsx, .csv</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Huỷ
        </Button>
        
        <Button
          variant="primary"
          onClick={handleExport}
          disabled={!selectedDataType}
          className="px-6 py-2"
        >
          Import
        </Button>
      </div>
    </>
  );

  const renderExportingState = () => (
    <div className="text-center py-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
          Đang xuất dữ liệu...
        </h3>
        
        <div className="mb-4">
          <Progress 
            percent={Math.round(exportProgress)} 
            strokeColor="var(--primary)"
            trailColor="var(--border)"
            size="default"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>File</span>
            <span className="text-sm font-medium text-[var(--primary)]">
              {exportedFileName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ngày xuất</span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {formatDateTime(new Date())}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={handleCancel}
          disabled
          className="px-6 py-2 opacity-50 cursor-not-allowed bg-gray-400 text-white"
        >
          Huỷ
        </Button>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="text-center py-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-6">
          Xuất dữ liệu thành công!
        </h3>

        <div className="bg-gray-50 rounded-lg p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>File</span>
            <span className="text-sm font-medium text-[var(--primary)]">
              {exportedFileName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ngày xuất</span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {formatDateTime(new Date())}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleOK}
          className="px-8 py-2"
        >
          OK
        </Button>
      </div>
    </div>
  );

  const getModalTitle = () => {
    switch (exportState) {
      case 'initial':
        return 'Export dữ liệu';
      case 'exporting':
        return 'Export dữ liệu';
      case 'success':
        return 'Export dữ liệu';
      default:
        return 'Export dữ liệu';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={getModalTitle()}
      variant="centered"
      size="md"
      className={`export-modal themed-modal ${className || ''}`}
    >
      {exportState === 'initial' && renderInitialState()}
      {exportState === 'exporting' && renderExportingState()}
      {exportState === 'success' && renderSuccessState()}
    </Modal>
  );
};

export default PopupExport;
