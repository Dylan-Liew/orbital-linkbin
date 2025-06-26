'use client'

import { useState } from 'react';
import { getAuthToken } from '@/lib/auth';
import { validatePassword } from '@/lib/validatePassword';

export default function Settings() {
  const [newUsername, setNewUsername] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isUsernameLoading, setIsUsernameLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);



  const handleUsernameChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsernameSuccess("");
    setUsernameError("");
    setIsUsernameLoading(true);

    try {
      const token = getAuthToken();
      const response = await fetch("/api/profile/change_username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ newUsername })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change username");
      }

      setUsernameSuccess("Username changed successfully");
      setNewUsername("");
    } catch (error) {
      setUsernameError(error instanceof Error ? error.message : "Failed to change username");
    } finally {
      setIsUsernameLoading(false);
    }
  };
  

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const validatePasswordError = validatePassword(newPassword);
    if (validatePasswordError) {
      setPasswordError(validatePasswordError);
      return;
    }

    setIsPasswordLoading(true);

    try {
      const token = getAuthToken();
      const response = await fetch("/api/profile/change_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setPasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="py-6">
      
      <div className="grid gap-8 md:grid-cols-2">


        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Change Username</h3>
          <form onSubmit={handleUsernameChange} className="space-y-4">
            {usernameError && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {usernameError}
              </div>
            )}
            {usernameSuccess && (
              <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm">
                {usernameSuccess}
              </div>
            )}
            <div>
              <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700">
                New Username
              </label>
              <input
                id="newUsername"
                name="newUsername"
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new username"
              />
            </div>
            <button
              type="submit"
              disabled={isUsernameLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isUsernameLoading ? "Updating..." : "Update Username"}
            </button>
          </form>
        </div>



        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm">
                {passwordSuccess}
              </div>
            )}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>
            <button
              type="submit"
              disabled={isPasswordLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isPasswordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}