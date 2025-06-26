'use client'

import { useState } from "react";
import { getAuthToken } from "@/lib/auth";

export default function ShareText() {
  const [text, setText] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const token = getAuthToken();
      const response = await fetch("/api/snippet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
      
      setShareLink(data.link);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8">


      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="text-input" className="text-sm font-medium text-gray-700">
            Enter text to share
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full p-2 border min-h-[200px] mt-2"
            required
          />
          <div className="mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="text-white px-4 py-2 hover:bg-blue-700 bg-blue-600 rounded"
            >
              {isLoading ? "Creating link..." : "Create link"}
            </button>
          </div>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {shareLink && (
        <div className="mt-6">
          <h3 className="font-medium text-lg mb-2">Your text share link:</h3>

          <div className="flex items-center gap-2">
            <a 
              href={shareLink} 
              target="_blank" 
              className="text-blue-600 hover:underline"
            >
              {shareLink}
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                alert("Copied to clipboard");
              }}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Copy to clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}