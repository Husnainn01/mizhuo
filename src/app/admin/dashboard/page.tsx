'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status');
        
        // Try the Edge-compatible endpoint first
        let response = await fetch('/api/auth/session/edge', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'  // Important for sending cookies
        });
        
        console.log('Edge session check response status:', response.status);
        
        // If Edge endpoint fails, try the regular session endpoint
        if (!response.ok) {
          console.log('Edge session check failed, trying regular session endpoint');
          
          response = await fetch('/api/auth/session', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          });
          
          console.log('Regular session check response status:', response.status);
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Session check failed:', errorData);
          throw new Error(errorData.error || 'Authentication failed');
        }
        
        const data = await response.json();
        console.log('Session data received:', data);
        
        if (!data.success || !data.user) {
          throw new Error('Invalid session data');
        }
        
        setUserEmail(data.user.email);
        
        // Set username from data or fallback to email
        if (data.user.firstName && data.user.lastName) {
          setUserName(`${data.user.firstName} ${data.user.lastName}`);
        } else {
          setUserName(data.user.email.split('@')[0]);
        }
        
        setLoading(false);
      } catch (error: any) {
        console.error('Authentication error:', error);
        setError(error.message || 'Authentication failed');
        
        // Try to manually extract token from cookies as last-resort fallback
        try {
          const authToken = document.cookie
            .split(';')
            .find(c => c.trim().startsWith('auth_token='));
            
          if (authToken) {
            const token = authToken.split('=')[1];
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              if (payload.email) {
                console.log('Extracted user info from token:', payload);
                setUserEmail(payload.email);
                setUserName(payload.email.split('@')[0]);
                setError(''); // Clear error since we have user info
                setLoading(false);
                return; // Skip redirect
              }
            }
          }
        } catch (e) {
          console.error('Failed to extract token data:', e);
        }
        
        // Redirect to login after a short delay to show the error
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      console.log('Logout response:', response.status);
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      console.log('Logout successful, redirecting to login');
      router.push('/admin/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message || 'Logout failed');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md max-w-md text-center">
            <p>{error}</p>
            <p className="text-sm mt-2">Redirecting to login page...</p>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">AutoElite Admin</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {userName} {userEmail && `(${userEmail})`}
            </span>
            <button 
              onClick={handleLogout}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
          <p className="text-gray-600">Welcome to the AutoElite administration panel.</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Car Listings Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Car Listings</h3>
              <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V7a1 1 0 00-1-1H3zM17 15h-1.05a2.5 2.5 0 00-4.9 0H7a1 1 0 01-1-1V7a1 1 0 011-1h9a1 1 0 011 1v8z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">21</p>
            <p className="text-sm text-gray-500 mt-1">Active listings</p>
            <Link 
              href="/admin/cars" 
              className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Manage listings
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {/* User Inquiries Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Inquiries</h3>
              <div className="p-2 bg-green-50 rounded-full text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">8</p>
            <p className="text-sm text-gray-500 mt-1">New inquiries</p>
            <Link 
              href="/admin/inquiries" 
              className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View inquiries
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {/* Users Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Users</h3>
              <div className="p-2 bg-purple-50 rounded-full text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">43</p>
            <p className="text-sm text-gray-500 mt-1">Registered users</p>
            <Link 
              href="/admin/users" 
              className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Manage users
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {/* Statistics Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Website Traffic</h3>
              <div className="p-2 bg-yellow-50 rounded-full text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">1.2k</p>
            <p className="text-sm text-gray-500 mt-1">Visitors today</p>
            <Link 
              href="/admin/statistics" 
              className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View statistics
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    New car listing added
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    John Smith
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    2023-10-15 14:32
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    User inquiry received
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Sarah Johnson
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    2023-10-15 10:15
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    Car price updated
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Michael Brown
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    2023-10-14 16:45
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link 
              href="/admin/activity" 
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all activity
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 