"use client";
import React, { useState } from 'react';
import { Pagination, Table2 } from '@/shared/ui';
import type { TableColumn } from '@/shared/ui/core/Table2';

interface ImportExportRecord {
  id: string;
  date: string;
  dataType: string;
  action: 'Import' | 'Export';
  status: 'success' | 'error';
  performer: string;
}

const TableImEx: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Sample data based on the image
  const dataSource: ImportExportRecord[] = [
    {
      id: '1',
      date: 'March 6, 2018',
      dataType: 'President of Sales',
      action: 'Import',
      status: 'success',
      performer: 'Marvin McKinney'
    },
    {
      id: '2',
      date: 'May 29, 2017',
      dataType: 'Medical Assistant',
      action: 'Export',
      status: 'success',
      performer: 'Albert Flores'
    },
    {
      id: '3',
      date: 'August 7, 2017',
      dataType: 'Web Designer',
      action: 'Import',
      status: 'success',
      performer: 'Jerome Bell'
    },
    {
      id: '4',
      date: 'April 28, 2016',
      dataType: 'Marketing Coordinator',
      action: 'Import',
      status: 'success',
      performer: 'Annette Black'
    },
    {
      id: '5',
      date: 'October 25, 2019',
      dataType: 'Marketing Coordinator',
      action: 'Export',
      status: 'success',
      performer: 'Wade Warren'
    },
    {
      id: '6',
      date: 'September 24, 2017',
      dataType: 'Marketing Coordinator',
      action: 'Export',
      status: 'success',
      performer: 'Cody Fisher'
    },
    {
      id: '7',
      date: 'September 24, 2017',
      dataType: 'Marketing Coordinator',
      action: 'Export',
      status: 'success',
      performer: 'Cody Fisher'
    },
    {
      id: '8',
      date: 'September 24, 2017',
      dataType: 'Marketing Coordinator',
      action: 'Export',
      status: 'error',
      performer: 'Cody Fisher'
    },
    {
      id: '9',
      date: 'September 24, 2017',
      dataType: 'Marketing Coordinator',
      action: 'Export',
      status: 'error',
      performer: 'Cody Fisher'
    },
    {
      id: '10',
      date: 'September 24, 2017',
      dataType: 'Marketing Coordinator',
      action: 'Export',
      status: 'error',
      performer: 'Cody Fisher'
    },
    {
      id: '11',
      date: 'September 24, 2017',
      dataType: 'Marketing Coordinator',
      action: 'Export',
      status: 'error',
      performer: 'Cody Fisher'
    },
    {
      id: '12',
      date: 'September 24, 2017',
      dataType: 'Marketing Coordinator',
      action: 'Export',
      status: 'error',
      performer: 'Cody Fisher'
    }
  ];

  // Define columns
  const columns: TableColumn<ImportExportRecord>[] = [
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      sorter: (a: ImportExportRecord, b: ImportExportRecord) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Loại dữ liệu',
      dataIndex: 'dataType',
      key: 'dataType',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      align: 'center',
      render: (action: string) => (
        <span className={`px-3 py-1 rounded text-sm font-medium ${
          action === 'Import' 
            ? 'action-import' 
            : 'action-export'
        }`}>
          {action}
        </span>
      ),
      filters: [
        { text: 'Import', value: 'Import' },
        { text: 'Export', value: 'Export' },
      ],
      onFilter: (value: boolean | React.Key, record: ImportExportRecord) => record.action === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      align: 'center',
      render: (status: string) => (
        <span className={`px-3 py-1 rounded text-sm font-medium ${
          status === 'success'
            ? 'status-success'
            : 'status-error'
        }`}>
          {status === 'success' ? 'Thành công' : 'Lỗi'}
        </span>
      ),
      filters: [
        { text: 'Thành công', value: 'success' },
        { text: 'Lỗi', value: 'error' },
      ],
      onFilter: (value: boolean | React.Key, record: ImportExportRecord) => record.status === value,
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'performer',
      key: 'performer',
      width: 180,
      ellipsis: true,
    },
  ];

  // Pagination logic
  const totalPages = Math.ceil(dataSource.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = dataSource.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="w-full">
      <Table2<ImportExportRecord>
        columns={columns}
        dataSource={currentData}
        rowKey="id"
        bordered
        size="middle"
        pagination={false} 
        // rowSelection={{
        //   type: 'checkbox',
        //   selectedRowKeys,
        //   onChange: handleRowSelectionChange,
        //   getCheckboxProps: (record) => ({
        //     name: record.id,
        //   }),
        // }}
        scroll={{ x: 800 }}
        className="custom-table-imex"
      />
      
      {/* Custom Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center">
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPrevious={handlePrevious}
            onNext={handleNext}
            showPageNumbers={true}
            maxVisiblePages={5}
            className="table-pagination"
          />

        </div>
      )}
    </div>
  );
};

export default TableImEx;
