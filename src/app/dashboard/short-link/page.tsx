"use client";

import { getAuthToken } from "@/lib/auth";
import { useState } from "react";

const FORM_INPUT_ID = "url-input";

export default function ShortLink() {
  const [url, setUrl] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const token = getAuthToken();
      const response = await fetch("/api/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
      
      setShortLink(data.link);


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
            <label htmlFor={FORM_INPUT_ID} className="text-sm font-medium text-gray-700">
              Paste URL here
            </label>
            <div className="flex">
              <input
                id={FORM_INPUT_ID}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/your-long-url"
                className="flex-grow p-2 border"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="text-white px-4 py-2 hover:bg-blue-700 bg-blue-600"
              >
                {isLoading ? "Shortening..." : "Shorten"}
              </button>
            </div>
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700">
            {error}
          </div>
        )}
        


        {shortLink && (
          <div className="mt-6">
            <h3 className="font-medium text-lg mb-2">Your shortened URL</h3>


            <div className="flex items-center gap-2">
              <a 
                href={shortLink} 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                {shortLink}
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(shortLink);
                  alert("Copied to clipboard");
                }}
                className="p-2 bg-gray-100 hover:bg-gray-200"
              >
                Copy to clipboard
              </button>
            </div>
          </div>
        )}
      </div>
  );
}