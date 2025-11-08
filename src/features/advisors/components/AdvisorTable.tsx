import React, { useMemo, useState } from 'react';
import { CardTable } from '@/shared/ui/core/CardTable';
import { AdvisorCard, type AdvisorCardProps } from '@/shared/ui/common/AdvisorCard';
import AdvisorFilter from './AdvisorFilter';
import { useGetAdvisors } from '@/tanstack/hooks/advisor';
import type { Advisor } from '@/types/advisor';

const resolveAvatarUrl = (path?: string) => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
  const normalizedPath = path.replace(/^\/+/, '');

  return baseUrl ? `${baseUrl}/${normalizedPath}` : path;
};

const mapAdvisorToCardProps = (advisor: Advisor): AdvisorCardProps => {
  const fullName = `${advisor.firstName ?? ''} ${advisor.lastName ?? ''}`.trim();

  return {
    id: advisor.id,
    name: fullName || advisor.email,
    email: advisor.email,
    phone: advisor.phone,
    avatarUrl: resolveAvatarUrl(advisor.profilePicture),
    specialty: advisor.specialties || 'Chưa cập nhật',
    experience:
      typeof advisor.yearsExperience === 'number'
        ? `${advisor.yearsExperience} năm`
        : 'Chưa cập nhật',
    clients: 0,
    rating: typeof advisor.rating === 'number' ? advisor.rating : 0,
    statusLabel: advisor.isActive ? 'Hoạt động' : 'Ngưng hoạt động',
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
            />
          )}
        />
      )}
    </div>
  );
};

export default AdvisorTable;
