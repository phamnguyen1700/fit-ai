import React, { useMemo, useState } from 'react';
import { CardTable } from '@/shared/ui/core/CardTable';
import { UserCard, type UserCardProps } from '@/shared/ui/common/UserCard';
import UserFilter from './UserFilter';

export interface UserTableProps {
  users?: UserCardProps[];
}

export const UserTable: React.FC<UserTableProps> = ({ 
  users = []
}) => {
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handlePlanChange = (key: string) => {
    setSelectedPlan(key);
  };

  const handleStatusChange = (key: string) => {
    setSelectedStatus(key);
  };
  // Filter users dựa trên plan và status
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesPlan = selectedPlan === 'all' || 
                         user.planLabel.toLowerCase().includes(selectedPlan.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || 
                           user.statusLabel.toLowerCase().includes(selectedStatus.toLowerCase());
      
      return matchesPlan && matchesStatus;
    });
  }, [users, selectedPlan, selectedStatus]);

  return (
    <div className="flex flex-col gap-2">

    <UserFilter 
        onPlanChange={handlePlanChange}
        onStatusChange={handleStatusChange}
      />
    <CardTable
      items={filteredUsers}
      pageSize={6}
      renderItem={(item, index) => (
        <UserCard
          id={item.id || (index + 1).toString()}
          name={item.name}
          email={item.email}
          avatarUrl={item.avatarUrl}
          datetime={item.datetime}
          planLabel={item.planLabel}
          amountLabel={item.amountLabel}
          statusLabel={item.statusLabel}
          isActive={item.isActive}
        />
        
      )}
    />
        </div>

  );
};

export default UserTable;


