import React, { useMemo, useState } from 'react';
import { CardTable } from '@/shared/ui/core/CardTable';
import { AdvisorCard, type AdvisorCardProps } from '@/shared/ui/common/AdvisorCard';
import AdvisorFilter from './AdvisorFilter';

export interface AdvisorTableProps {
  advisors?: AdvisorCardProps[];
}

export const AdvisorTable: React.FC<AdvisorTableProps> = ({ 
  advisors = []
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

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
    </div>
  );
};

export default AdvisorTable;
