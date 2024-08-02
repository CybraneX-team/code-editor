import React, { useState, useCallback, useEffect } from 'react';

const RepoContents: React.FC<{ files: any[] }> = ({ files }) => {
    if (files.length === 0) return null;
  
    return (
      <div className="mt-4 mb-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
        <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Repository Contents:</h4>
        <ul className="list-disc pl-5">
          {files.map((file, index) => (
            <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
              {file.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  export default RepoContents;