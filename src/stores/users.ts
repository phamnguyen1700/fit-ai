import { useAppStore } from './app.store';

// Users module - chỉ export những gì cần cho users
export const useUsersStore = () => {
  const store = useAppStore();
  
  return {
    // Data
    users: store.users,
    selectedUser: store.selectedUser,
    loading: store.usersLoading,
    error: store.usersError,
    
    // Actions
    setUsers: store.setUsers,
    addUser: store.addUser,
    updateUser: store.updateUser,
    removeUser: store.removeUser,
    setSelectedUser: store.setSelectedUser,
    setUsersLoading: store.setUsersLoading,
    setUsersError: store.setUsersError,
  };
};
