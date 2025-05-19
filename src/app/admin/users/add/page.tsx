'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminPanelLayout from '@/components/admin/AdminPanelLayout';
import { USER_ROLES, PERMISSIONS } from '@/models/UserConstants';

export default function AddUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'viewer' as string,
    permissions: [] as string[]
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        // Redirect to login
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          permissions: [...prev.permissions, value]
        };
      } else {
        return {
          ...prev,
          permissions: prev.permissions.filter(p => p !== value)
        };
      }
    });
  };
  
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    
    // Update permissions based on role
    const rolePermissions: string[] = [];
    if (role === 'editor') {
      rolePermissions.push(
        PERMISSIONS.READ_CAR,
        PERMISSIONS.CREATE_CAR,
        PERMISSIONS.UPDATE_CAR,
        PERMISSIONS.READ_ATTRIBUTE,
        PERMISSIONS.CREATE_ATTRIBUTE,
        PERMISSIONS.UPDATE_ATTRIBUTE,
        PERMISSIONS.READ_INQUIRY,
        PERMISSIONS.UPDATE_INQUIRY
      );
    } else if (role === 'viewer') {
      rolePermissions.push(
        PERMISSIONS.READ_CAR,
        PERMISSIONS.READ_ATTRIBUTE,
        PERMISSIONS.READ_INQUIRY
      );
    } else if (role === 'admin') {
      // Admin has all permissions
      Object.values(PERMISSIONS).forEach(p => rolePermissions.push(p));
    }
    
    setFormData(prev => ({
      ...prev,
      role,
      permissions: rolePermissions
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }
      
      setSuccessMessage('User created successfully!');
      
      // Clear the form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'viewer',
        permissions: []
      });
      
      // Redirect to users list after a short delay
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (error: any) {
      console.error('Error creating user:', error);
      setErrorMessage(error.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get permission groups
  const permissionGroups = {
    'Cars': [
      PERMISSIONS.READ_CAR,
      PERMISSIONS.CREATE_CAR,
      PERMISSIONS.UPDATE_CAR,
      PERMISSIONS.DELETE_CAR
    ],
    'Attributes': [
      PERMISSIONS.READ_ATTRIBUTE,
      PERMISSIONS.CREATE_ATTRIBUTE,
      PERMISSIONS.UPDATE_ATTRIBUTE,
      PERMISSIONS.DELETE_ATTRIBUTE
    ],
    'Users': [
      PERMISSIONS.READ_USER,
      PERMISSIONS.CREATE_USER,
      PERMISSIONS.UPDATE_USER,
      PERMISSIONS.DELETE_USER
    ],
    'Inquiries': [
      PERMISSIONS.READ_INQUIRY,
      PERMISSIONS.UPDATE_INQUIRY,
      PERMISSIONS.DELETE_INQUIRY
    ]
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

  // Helper function to format permission name
  const formatPermissionName = (permission: string) => {
    const parts = permission.split(':');
    const action = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const resource = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    return `${action} ${resource}`;
  };

  return (
    <AdminPanelLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Link 
              href="/admin/users"
              className="mr-4 text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Add New User</h1>
          </div>
          <p className="text-gray-600">Create a new user with specific role and permissions.</p>
        </div>
        
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-600 text-red-700">
            <p>{errorMessage}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-600 text-green-700">
            <p>{successMessage}</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
              </div>
              
              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleRoleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {USER_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Permissions Section */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-3">Permissions</h3>
              <p className="text-sm text-gray-500 mb-4">
                Permissions are automatically assigned based on the selected role. You can customize them below.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(permissionGroups).map(([group, permissions]) => (
                  <div key={group} className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-medium text-gray-800 mb-2">{group}</h4>
                    <div className="space-y-2">
                      {permissions.map(permission => (
                        <div key={permission} className="flex items-center">
                          <input
                            type="checkbox"
                            id={permission}
                            name="permissions"
                            value={permission}
                            checked={formData.permissions.includes(permission)}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={permission} className="ml-2 text-sm text-gray-700">
                            {formatPermissionName(permission)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/users"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminPanelLayout>
  );
} 