'use client';

import React from 'react';
import { Row, Col } from '@/shared/ui';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';


export function AdvisorChat() {
  const [selectedClient, setSelectedClient] = React.useState<string | null>('1');

  return (
    <Row gutter={[16, 0]} style={{ height: 'calc(100vh - 200px)' }}>
      {/* Chat List - Danh sách khách hàng */}
      <Col span={8}>
        <ChatList 
          selectedClient={selectedClient} 
          onSelectClient={setSelectedClient} 
        />
      </Col>
      
      {/* Chat Window - Cửa sổ chat */}
      <Col span={16}>
        {selectedClient ? (
          <ChatWindow clientId={selectedClient} />
        ) : (
          <div className="flex items-center justify-center h-full bg-white rounded-lg">
            <p className="text-gray-400">Chọn một khách hàng để bắt đầu chat</p>
          </div>
        )}
      </Col>
    </Row>
  );
}
