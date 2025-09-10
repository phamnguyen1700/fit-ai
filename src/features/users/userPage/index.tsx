'use client';

import React, { useState } from 'react';
// Define types locally since we're using fake data
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'trainer' | 'user';
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'trainer' | 'user';
}

export interface UpdateUserRequest extends CreateUserRequest {
  id: string;
}

export interface ChangePasswordRequest {
  id: string;
  currentPassword: string;
  newPassword: string;
}
import { useUsersStore } from '@/stores/users';
import { useModalStore } from '@/stores/modal.store';
import { useFilterStore } from '@/stores/filter.store';
import { UserToolbar } from '../components/UserToolbar';
import { UserTable } from '../components/UserTable';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

export const UserPage: React.FC = () => {
  // Fake data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'admin@fitai.com',
      name: 'Admin User',
      phone: '0123456789',
      role: 'admin',
      isActive: true,
      lastLoginAt: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      email: 'trainer@fitai.com',
      name: 'Trainer User',
      phone: '0987654321',
      role: 'trainer',
      isActive: true,
      lastLoginAt: '2024-01-14T15:20:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-14T15:20:00Z',
    },
    {
      id: '3',
      email: 'user1@email.com',
      name: 'Nguyễn Văn A',
      phone: '0123456788',
      role: 'user',
      isActive: true,
      lastLoginAt: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
    },
    {
      id: '4',
      email: 'user2@email.com',
      name: 'Trần Thị B',
      phone: '0987654320',
      role: 'user',
      isActive: false,
      lastLoginAt: '2024-01-10T16:45:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-10T16:45:00Z',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Users data
  const usersStore = useUsersStore();
  const selectedUser = usersStore.selectedUser;
  
  // Modal states
  const modalStore = useModalStore();
  const isCreateModalOpen = modalStore.type === 'create-user';
  const isEditModalOpen = modalStore.type === 'edit-user';
  const isDeleteModalOpen = modalStore.type === 'delete-user';
  const isChangePasswordModalOpen = modalStore.type === 'change-password';
  
  // Actions
  const openCreateModal = () => modalStore.openModal('create-user');
  const openEditModal = (user: any) => modalStore.openModal('edit-user', user);
  const openDeleteModal = (user: any) => modalStore.openModal('delete-user', user);
  const openChangePasswordModal = (user: any) => modalStore.openModal('change-password', user);
  const closeModal = () => modalStore.closeModal();

  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    name: '',
    phone: '',
    role: 'user',
  });

  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    id: '',
    currentPassword: '',
    newPassword: '',
  });

  const handleCreateUser = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setUsers(prev => [newUser, ...prev]);
      closeModal();
      resetForm();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser: User = {
        ...selectedUser,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? updatedUser : user
      ));
      closeModal();
      resetForm();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      closeModal();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser: User = {
        ...user,
        isActive: !user.isActive,
        updatedAt: new Date().toISOString(),
      };
      
      setUsers(prev => prev.map(u => 
        u.id === user.id ? updatedUser : u
      ));
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      closeModal();
      resetPasswordForm();
      alert('Mật khẩu đã được thay đổi thành công!');
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Mật khẩu đã được reset thành công!');
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      phone: '',
      role: 'user',
    });
  };

  const resetPasswordForm = () => {
    setPasswordData({
      id: '',
      currentPassword: '',
      newPassword: '',
    });
  };

  const openEditModalWithData = (user: User) => {
    setFormData({
      email: user.email,
      name: user.name,
      phone: user.phone || '',
      role: user.role,
    });
    openEditModal(user);
  };

  const openChangePasswordModalWithData = (user: User) => {
    setPasswordData({
      id: user.id,
      currentPassword: '',
      newPassword: '',
    });
    openChangePasswordModal(user);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
              <p className="text-gray-600 mt-1">Quản lý tài khoản người dùng và quyền hạn</p>
            </div>
          </div>

          <UserToolbar />

          <UserTable
            users={users}
            onEdit={openEditModalWithData}
            onDelete={openDeleteModal}
            onToggleStatus={handleToggleStatus}
            onChangePassword={openChangePasswordModalWithData}
          />

          {/* Create/Edit Modal */}
          <Modal
            isOpen={isCreateModalOpen || isEditModalOpen}
            onClose={closeModal}
            title={isCreateModalOpen ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên người dùng"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' | 'trainer' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">Người dùng</option>
                  <option value="trainer">Huấn luyện viên</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="secondary"
                  onClick={closeModal}
                >
                  Hủy
                </Button>
                <Button
                  onClick={isCreateModalOpen ? handleCreateUser : handleUpdateUser}
                >
                  {isCreateModalOpen ? 'Tạo người dùng' : 'Cập nhật'}
                </Button>
              </div>
            </div>
          </Modal>

          {/* Change Password Modal */}
          <Modal
            isOpen={isChangePasswordModalOpen}
            onClose={closeModal}
            title="Đổi mật khẩu"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="secondary" onClick={closeModal}>
                  Hủy
                </Button>
                <Button onClick={handleChangePassword}>
                  Đổi mật khẩu
                </Button>
              </div>
            </div>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={closeModal}
            title="Xác nhận xóa người dùng"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.name}</strong>? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={closeModal}>
                  Hủy
                </Button>
                <Button variant="danger" onClick={handleDeleteUser}>
                  Xóa
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};
