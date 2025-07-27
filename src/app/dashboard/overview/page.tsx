'use client';

import { useState, useEffect } from 'react';
import { getAuthToken } from '@/lib/auth';

interface Share {
  id: number;
  type: string;
  shortLink: string;
  expirationTime: Date | null;
  createdAt: Date;
  viewCount: number;
}

interface DashboardStats {
  totalViews: number;
  totalShares: number;
  expiredShares: number;
}

export default function Overview() {
  const [shares, setShares] = useState<Share[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalShares: 0,
    expiredShares: 0
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchShares = async () => {
    try {
      const token = getAuthToken();

      const response = await fetch("/api/s", {
          headers: {
          "Authorization": `Bearer ${token}`
          }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch shares");
      } 
      
      const data = await response.json();
      const sharesData = data.shares;
      setShares(sharesData);

      const now = new Date();
      const totalViews = sharesData.reduce((sum: number, share: Share) => sum + share.viewCount, 0);
      const totalShares = sharesData.length;
      const expiredShares = sharesData.filter((share: Share) => share.expirationTime && new Date(share.expirationTime) < now).length;

      setStats({
        totalViews,
        totalShares,
        expiredShares
      });
      
    } catch (error) {
      console.error("Error fetching shares:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) return;

    try {
      const token = getAuthToken();

      const response = await fetch("/api/s", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ids: selectedItems })
      });

      if (response.ok) {
        setSelectedItems([]);
        fetchShares();
      }
    } catch (error) {
      console.error("Error deleting shares:", error);
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === shares.length ? [] : shares.map(share => share.id)
    );
  };

  const isExpired = (expirationTime: Date | null) => {
    if (!expirationTime) return false;
    return new Date(expirationTime) < new Date();
  };

  useEffect(() => {
    fetchShares();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="text-3xl font-bold">{stats.totalViews}</div>
          <div className="text-blue-100">Total Views</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="text-3xl font-bold">{stats.totalShares}</div>
          <div className="text-green-100">Total Shares</div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg text-white">
          <div className="text-3xl font-bold">{stats.expiredShares}</div>
          <div className="text-red-100">Expired Shares</div>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Your Shares</h3>
            {selectedItems.length > 0 && (
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Delete Selected ({selectedItems.length})
              </button>
            )}
          </div>
        </div>
        
        {shares.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No shares found. Create your first share using the tabs above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === shares.length && shares.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Short Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shares.map((share) => (
                  <tr key={share.id} className={selectedItems.includes(share.id) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(share.id)}
                        onChange={() => toggleSelectItem(share.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {share.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`/s/${share.shortLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {share.shortLink}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {share.viewCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(share.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isExpired(share.expirationTime) ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}