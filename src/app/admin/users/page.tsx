'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminPanelLayout from '@/components/admin/AdminPanelLayout';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';
import { USER_ROLES } from '@/models/UserConstants';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export default function UsersManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated via session API
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session/edge', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        
        const data = await response.json();
        
        if (!data.success || !data.user || data.user.role !== 'admin') {
          throw new Error('Admin access required');
        }
        
        // Fetch users
        fetchUsers();
      } catch (error) {
        console.error('Auth check failed:', error);
        // Redirect to login
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router]);
  
  const fetchUsers = async (role?: string) => {
    try {
      setIsLoading(true);
      
      const url = role ? 
        `/api/admin/users?role=${encodeURIComponent(role)}` : 
        '/api/admin/users';
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users || []);
      } else {
        throw new Error(data.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRoleFilter = (role: string | null) => {
    setSelectedRole(role);
    fetchUsers(role || undefined);
  };
  
  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };
  
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };
  
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    
    try {
      // Call the delete API endpoint
      const response = await fetch(`/api/admin/users/${userToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }
      
      // Close the dialog
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      
      // Refresh the users list
      fetchUsers(selectedRole || undefined);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(`Error: ${error.message || 'Failed to delete user'}`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Get role display name
  const getRoleDisplayName = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminPanelLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">User Management</h1>
          
          <Link 
            href="/admin/users/add"
            className="flex items-center justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New User
          </Link>
        </div>
        
        {/* Role Tabs */}
        <div className="flex flex-wrap mb-6 border-b overflow-x-auto pb-1">
          <button
            onClick={() => handleRoleFilter(null)}
            className={`py-2 px-4 mr-2 font-medium text-sm ${
              selectedRole === null
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All Users
          </button>
          
          {USER_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleFilter(role)}
              className={`py-2 px-4 mr-2 font-medium text-sm ${
                selectedRole === role
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {getRoleDisplayName(role)}s
            </button>
          ))}
        </div>
        
        {/* Users Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Created</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{`${user.firstName} ${user.lastName}`}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'editor'
                              ? 'bg-blue-100 text-blue-800'
                              : user.role === 'viewer'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/admin/users/edit/${user._id}`}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button 
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            title="Delete"
                            onClick={() => openDeleteDialog(user)}
                            disabled={isDeleting || user.role === 'admin'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                      {selectedRole 
                        ? `No ${selectedRole} users available.` 
                        : 'No users available.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.firstName} ${userToDelete?.lastName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteUser}
        onCancel={closeDeleteDialog}
        isLoading={isDeleting}
        type="danger"
      />
    </AdminPanelLayout>
  );
} 