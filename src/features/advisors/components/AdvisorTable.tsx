import React, { useMemo, useState } from 'react';
import { CardTable } from '@/shared/ui/core/CardTable';
import { AdvisorCard, type AdvisorCardProps } from '@/shared/ui/common/AdvisorCard';
import AdvisorFilter from './AdvisorFilter';
import { useGetAdvisors, useSoftDeleteAdvisor, useReactivateAdvisor } from '@/tanstack/hooks/advisor';
import type { Advisor } from '@/types/advisor';
import { App } from 'antd';

const resolveAvatarUrl = (path?: string) => {
  if (!path) return undefined;
  if (path.startsWith('http')) return encodeURI(path);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
  const normalizedPath = path.replace(/^\/+/, '');

  const resolved = baseUrl ? `${baseUrl}/${normalizedPath}` : path;
  return encodeURI(resolved);
};

const normalizeSpecialties = (specialties?: string[] | string) => {
  if (Array.isArray(specialties)) {
    return specialties;
  }

  if (typeof specialties === 'string') {
    return specialties
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const mapAdvisorToCardProps = (advisor: Advisor): AdvisorCardProps => {
  const fullName = `${advisor.firstName ?? ''} ${advisor.lastName ?? ''}`.trim();
  const specialties = normalizeSpecialties(advisor.specialties);
  const totalCustomers =
    typeof advisor.totalCustomers === 'number'
      ? advisor.totalCustomers
      : advisor.customers?.length ?? 0;

  return {
    id: advisor.id,
    name: fullName || advisor.email,
    email: advisor.email,
    phone: advisor.phone || 'Chưa cập nhật',
    avatarUrl: resolveAvatarUrl(advisor.profilePicture),
    specialty: specialties.length ? specialties.join(', ') : 'Chưa cập nhật',
    experience:
      typeof advisor.yearsExperience === 'number'
        ? `${advisor.yearsExperience} năm`
        : 'Chưa cập nhật',
    clients: totalCustomers,
    rating: typeof advisor.rating === 'number' ? advisor.rating : 0,
    statusLabel: advisor.isActive ? 'Hoạt động' : 'Ngưng hoạt động',
    isActive: advisor.isActive,
  };
};

export interface AdvisorTableProps {
  advisors?: AdvisorCardProps[];
}

export const AdvisorTable: React.FC<AdvisorTableProps> = ({ 
  advisors: fallbackAdvisors = []
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const pageSize = 24;

  const { data, isLoading, isError } = useGetAdvisors({ page: 1, pageSize });
  const softDeleteAdvisor = useSoftDeleteAdvisor();
  const reactivateAdvisor = useReactivateAdvisor();
  const { modal } = App.useApp();

  const advisors = useMemo(() => {
    const apiAdvisors = (data?.data || []) as Advisor[];
    if (!apiAdvisors.length) {
      return fallbackAdvisors;
    }

    return apiAdvisors.map(mapAdvisorToCardProps);
  }, [data?.data, fallbackAdvisors]);

  const handleSpecialtyChange = (key: string) => {
    setSelectedSpecialty(key);
  };

  const handleStatusChange = (key: string) => {
    setSelectedStatus(key);
  };

  const handleAdd = () => {
    console.log('Add new advisor');
    // TODO: Implement add advisor functionality
  };

  const handleMoreClick = (key: string) => {
    console.log('More action:', key);
    // TODO: Implement more actions (import, export, statistics)
  };

  const handleMenuClick = (key: string, advisorId: string) => {
    console.log('handleMenuClick called with:', { key, advisorId });
    const advisor = advisors.find(a => a.id === advisorId);
    console.log('Found advisor:', advisor);
    
    switch (key) {
      case 'deactivate':
        if (advisor) {
          console.log('Showing confirm modal for deactivate');
          modal.confirm({
            title: 'Xác nhận tạm dừng',
            content: `Bạn có chắc chắn muốn tạm dừng hoạt động của advisor "${advisor.name}"?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            okButtonProps: {
              type: 'primary',
              loading: softDeleteAdvisor.isPending,
              style: {
                backgroundColor: 'var(--primary)',
                borderColor: 'var(--primary)',
                color: 'white',
              },
            },
            onOk: () => {
              console.log('Modal confirmed, calling mutation for:', advisorId);
              return new Promise<void>((resolve, reject) => {
                softDeleteAdvisor.mutate(advisorId, {
                  onSuccess: (data) => {
                    console.log('Mutation success in onOk callback:', data);
                    resolve();
                  },
                  onError: (error) => {
                    console.error('Mutation error in onOk callback:', error);
                    reject(error);
                  },
                });
              });
            },
            onCancel: () => {
              console.log('Modal cancelled');
            },
          });
          console.log('Modal.confirm() called');
        } else {
          console.warn('Advisor not found for ID:', advisorId);
        }
        break;
      case 'reactivate':
        if (advisor) {
          console.log('Showing confirm modal for reactivate');
          modal.confirm({
            title: 'Xác nhận khởi động lại',
            content: `Bạn có chắc chắn muốn khởi động lại advisor "${advisor.name}"?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            okButtonProps: {
              type: 'primary',
              loading: reactivateAdvisor.isPending,
              style: {
                backgroundColor: 'var(--primary)',
                borderColor: 'var(--primary)',
                color: 'white',
              },
            },
            onOk: () => {
              console.log('Modal confirmed, calling reactivate mutation for:', advisorId);
              return new Promise<void>((resolve, reject) => {
                reactivateAdvisor.mutate(advisorId, {
                  onSuccess: (data) => {
                    console.log('Reactivate mutation success in onOk callback:', data);
                    resolve();
                  },
                  onError: (error) => {
                    console.error('Reactivate mutation error in onOk callback:', error);
                    reject(error);
                  },
                });
              });
            },
            onCancel: () => {
              console.log('Modal cancelled');
            },
          });
          console.log('Modal.confirm() called for reactivate');
        } else {
          console.warn('Advisor not found for ID:', advisorId);
        }
        break;
      default:
        break;
    }
  };

  // Filter advisors based on specialty and status
  const filteredAdvisors = useMemo(() => {
    return advisors.filter(advisor => {
      const matchesSpecialty = selectedSpecialty === 'all' || 
                               advisor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || 
                           advisor.statusLabel.toLowerCase().includes(selectedStatus.toLowerCase());
      
      return matchesSpecialty && matchesStatus;
    });
  }, [advisors, selectedSpecialty, selectedStatus]);

  return (
    <div className="flex flex-col gap-2">
      <AdvisorFilter 
        onAdd={handleAdd}
        onSpecialtyChange={handleSpecialtyChange}
        onStatusChange={handleStatusChange}
        onMoreClick={handleMoreClick}
      />
      {isLoading ? (
        <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
          Đang tải danh sách advisor...
        </div>
      ) : isError ? (
        <div className="py-12 text-center text-sm text-[var(--error)]">
          Không thể tải danh sách advisor. Vui lòng thử lại sau.
        </div>
      ) : filteredAdvisors.length === 0 ? (
        <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
          Không tìm thấy advisor phù hợp với bộ lọc.
        </div>
      ) : (
        <CardTable
          items={filteredAdvisors}
          pageSize={6}
          renderItem={(item, index) => (
            <AdvisorCard
              id={item.id || (index + 1).toString()}
              name={item.name}
              email={item.email}
              phone={item.phone}
              avatarUrl={item.avatarUrl}
              specialty={item.specialty}
              experience={item.experience}
              clients={item.clients}
              rating={item.rating}
              statusLabel={item.statusLabel}
              isActive={item.isActive}
              onMenuClick={handleMenuClick}
            />
          )}
        />
      )}
    </div>
  );
};

export default AdvisorTable;
