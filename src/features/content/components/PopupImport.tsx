"use client";
import React, { useState, useRef } from "react";
import { Modal, Button, Progress } from "@/shared/ui";
import { Icon, icons } from "@/shared/ui/icon";

export interface PopupImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (file: File) => void;
  className?: string;
}

type ImportState = 'initial' | 'uploading' | 'success';

export const PopupImport: React.FC<PopupImportProps> = ({
  isOpen,
  onClose,
  onImport,
  className,
}) => {
  const [importState, setImportState] = useState<ImportState>('initial');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls  
      'text/csv', // .csv
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Chỉ hỗ trợ file định dạng .xlsx, .csv, .xls');
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('Kích thước file không được vượt quá 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    if (importState === 'uploading') {
      return; // Don't allow cancel during upload
    }
    
    setImportState('initial');
    setSelectedFile(null);
    setUploadProgress(0);
    onClose();
  };

  const handleImport = () => {
    if (!selectedFile) return;

    setImportState('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setImportState('success');
          }, 300);
          return 100;
        }
        return prev + Math.random() * 15; // Random progress increment
      });
    }, 200);

    // Call the onImport callback
    onImport?.(selectedFile);
  };

  const handleOK = () => {
    setImportState('initial');
    setSelectedFile(null);
    setUploadProgress(0);
    onClose();
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('vi-VN') + ' - ' + 
           date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const renderInitialState = () => (
<>
      {/* File Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-10'
            : selectedFile
            ? 'border-[var(--primary)]'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        style={{ 
          backgroundColor: isDragOver 
            ? 'rgba(255, 140, 0, 0.1)' 
            : 'var(--bg)',
          borderColor: isDragOver || selectedFile 
            ? 'var(--primary)' 
            : 'var(--border)'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* File Upload Icon */}
        <div className="mb-3 flex justify-center">
          <div className="w-12 h-12 bg-opacity-10 rounded-lg flex items-center justify-center">
            <Icon 
              name={icons.file} 
              size={40} 
              color="var(--primary)" 
              className="background-white"
            />
          </div>
        </div>

        <h3 className="text-base font-semibold text-[var(--text)] mb-1">
          Kéo & thả file vào đây để tải lên
        </h3>
        
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          Hỗ trợ định dạng: .xlsx, .csv, .xls – tối đa 10MB
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Choose File Button - Outside the dashed border */}
      <div className="mb-4 mt-4">
        <Button
          variant="secondary"
          onClick={handleChooseFile}
          className="w-full px-6 py-2"
        >
          Chọn file từ máy
        </Button>
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="mb-4 flex items-center">
          <Icon name="mdi:file-excel" size={16} className="mr-2 text-green-600" />
          <span className="text-blue-600 font-medium text-sm">{selectedFile.name}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Huỷ
        </Button>
        
        <Button
          variant="primary"
          onClick={handleImport}
          disabled={!selectedFile}
          className="px-6 py-2"
        >
          Import
        </Button>
      </div>
   </>
  );

  const renderUploadingState = () => (
    <div className="text-center py-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
          Đang nhập vào dữ liệu...
        </h3>
        
        <div className="mb-4">
          <Progress 
            percent={Math.round(uploadProgress)} 
            strokeColor="var(--primary)"
            trailColor="var(--border)"
            size="default"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>File</span>
            <span className="text-sm font-medium text-[var(--primary)]">
              {selectedFile?.name}
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
          Nhập dữ liệu thành công!
        </h3>

        <div className="bg-gray-50 rounded-lg p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>File</span>
            <span className="text-sm font-medium text-[var(--primary)]">
              {selectedFile?.name?.replace(/\.[^/.]+$/, "_sep_2025.xlsx")}
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
    switch (importState) {
      case 'initial':
        return 'Import dữ liệu';
      case 'uploading':
        return 'Import dữ liệu';
      case 'success':
        return 'Import dữ liệu';
      default:
        return 'Import dữ liệu';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={getModalTitle()}
      variant="centered"
      size="md"
      className={`import-modal themed-modal ${className || ''}`}
    >
      {importState === 'initial' && renderInitialState()}
      {importState === 'uploading' && renderUploadingState()}
      {importState === 'success' && renderSuccessState()}
    </Modal>
  );
};

export default PopupImport;
