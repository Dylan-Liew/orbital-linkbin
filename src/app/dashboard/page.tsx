'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ShortLink from './short-link/page';
import ShareImage from './share-image/page';
import ShareText from './share-text/page';
import Settings from './settings/page';
import Overview from './overview/page';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    router.push('/');
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'short-link':
        return <ShortLink />;
      case 'share-image':
        return <ShareImage />;
      case 'share-text':
        return <ShareText />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">LinkBin</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'overview'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('short-link')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'short-link'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Short Links
            </button>
            <button
              onClick={() => setActiveTab('share-image')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'share-image'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Share Image
            </button>
            <button
              onClick={() => setActiveTab('share-text')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'share-text'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Share Text
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'settings'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}