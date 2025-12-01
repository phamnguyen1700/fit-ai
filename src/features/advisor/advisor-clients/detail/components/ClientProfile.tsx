'use client';

import React from 'react';
import { Card } from '@/shared/ui';

interface ClientProfileProps {
  clientId: string;
}

export default function ClientProfile({ clientId }: ClientProfileProps) {
  // Mock data - trong thực tế sẽ fetch từ API
  const client = {
    id: clientId,
    name: 'Nguyễn Văn A',
    age: 28,
    gender: 'Nam',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    height: 175,
    weight: 75,
    targetWeight: 68,
    goal: 'Giảm cân và tăng cơ',
    joinDate: '01/10/2024',
    trainer: 'Bạn',
    plan: 'Premium - 3 tháng',
    medicalHistory: 'Không có tiền sử bệnh lý',
    notes: 'Khách hàng rất chăm chỉ và có động lực cao',
  };

  const measurements = [
    { date: '01/10', weight: 75, bodyFat: 22, muscle: 35 },
    { date: '08/10', weight: 74, bodyFat: 21, muscle: 35.5 },
    { date: '15/10', weight: 73, bodyFat: 20, muscle: 36 },
    { date: '22/10', weight: 72, bodyFat: 19.5, muscle: 36.5 },
  ];

  return (
    <div className="space-y-4">
      {/* Personal Info */}
      <Card className="p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
            {client.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{client.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tuổi</p>
                <p className="font-semibold">{client.age} tuổi</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Giới tính</p>
                <p className="font-semibold">{client.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tham gia</p>
                <p className="font-semibold">{client.joinDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gói tập</p>
                <p className="font-semibold">{client.plan}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-6 border-t">
          <div>
            <h3 className="font-semibold mb-3">Thông tin liên hệ</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">{client.phone}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Chỉ số cơ thể</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Chiều cao</span>
                <span className="font-medium">{client.height} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Cân nặng hiện tại</span>
                <span className="font-medium">{client.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Mục tiêu cân nặng</span>
                <span className="font-medium text-primary">{client.targetWeight} kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Goal and Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
          <div>
            <h3 className="font-semibold mb-2">Mục tiêu</h3>
            <p className="text-gray-700">{client.goal}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Ghi chú</h3>
            <p className="text-gray-700">{client.notes}</p>
          </div>
        </div>

        {/* Medical History */}
        <div className="pt-6 border-t">
          <h3 className="font-semibold mb-2">Tiền sử bệnh lý</h3>
          <p className="text-gray-700">{client.medicalHistory}</p>
        </div>
      </Card>

      {/* Progress Tracking */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Lịch sử đo lường</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Ngày</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Cân nặng (kg)</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Mỡ cơ thể (%)</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Khối cơ (kg)</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((measurement, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{measurement.date}</td>
                  <td className="text-center py-3 px-4 font-medium">{measurement.weight}</td>
                  <td className="text-center py-3 px-4">{measurement.bodyFat}</td>
                  <td className="text-center py-3 px-4">{measurement.muscle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
