import React from 'react';
import { Icon as IconifyIcon } from '@iconify/react';

export interface IconProps {
  name: string; // icon name e.g. 'mdi:home', 'lucide:settings'
  size?: number | string;
  color?: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 18, color, className }) => {
  return <IconifyIcon icon={name} width={size} height={size} color={color} className={className} />;
};

// Common aliases for convenience
export const icons = {
  dashboard: 'mdi:view-dashboard-outline',
  users: 'mdi:account-multiple-outline',
  content: 'mdi:file-document-outline',
  feedback: 'mdi:message-text-outline',
  plans: 'mdi:clipboard-text-outline',
  payment: 'mdi:credit-card-outline',
  advisors: 'mdi:account-tie-outline',
  clients: 'mdi:account-group-outline',
  settings: 'mdi:cog-outline',
  logout: 'majesticons:logout',
  home: 'mdi:home-outline',
  chevronLeft: 'mdi:chevron-left',
  chevronRight: 'mdi:chevron-right',
  menu: 'majesticons:menu',
  message: 'mdi:message-outline',
  up: 'mdi:chevron-up',
  down: 'mdi:chevron-down',
  import: 'mdi:import',
  export: 'mdi:export',
  upload: 'mdi:upload',
  download: 'mdi:download',
  chevronDown : 'mdi:chevron-down',
  chevronUp : 'mdi:chevron-up',
  email: 'mdi:email-outline',
  password: 'mdi:lock-outline',
  phone: 'mdi:phone-outline',
  file : 'mdi:file-outline',
  workoutPlans: 'mdi:dumbbell',
  policies: 'mdi:file-document-edit-outline',
  foods: 'mdi:food-apple-outline',
};

// Usage: <Icon name={icons.dashboard} />
