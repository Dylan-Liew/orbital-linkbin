"use client";

import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function TextContentHighlight({ code }: { code: string }) {
  const [isShowLineNumbers, setIsShowLineNumbers] = useState(false);
  const [isSyntaxHighlighted, setIsSyntaxHighlighted] = useState(false);

  
  return (
    <>
      <div className="flex justify-between items-center bg-gray-100 p-2 border-b">
      <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isShowLineNumbers}
              onChange={() => setIsShowLineNumbers(!isShowLineNumbers)}
            />
            <span>Show line numbers</span>
          </label>
          
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isSyntaxHighlighted}
              onChange={() => setIsSyntaxHighlighted(!isSyntaxHighlighted)}
            />
            <span>Syntax highlighting</span>
          </label>
        </div>
        
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            alert("Copied to clipboard");
          }}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-sm rounded"
        >
          Copy
        </button>
      </div>
      
      <SyntaxHighlighter 
        style={docco} 
        showLineNumbers={isShowLineNumbers}
        language={isSyntaxHighlighted ? undefined : "text"}
      >
        {code}
      </SyntaxHighlighter>
    </>
  );
}