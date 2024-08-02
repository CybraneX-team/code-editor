"use client";

import React, { useState, useCallback } from "react";
import "./uploadPage.css";

const CreateNewProject: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleImportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFullScreen(false);
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setFiles(Array.from(event.dataTransfer.files));
    }
  }, []);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  const getFileNameDisplay = () => {
    if (files.length === 0) return "No file selected";
    if (files.length === 1) return files[0].name;
    return `${files[0].name} +${files.length - 1} files`;
  };
  const handleDelete = () => {
    setFiles([]);
    // Reset the file input
    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="bg-[#1e1e1e] ">
      <div
        className={`flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          isFullScreen ? "h-screen" : "h-auto"
        }`}
      >
        <h1 className="mb-8 mt-8 text-4xl font-extrabold text-black dark:text-white">
          Create a New Project
        </h1>
        <div
          className={`flex w-full h-[560px] max-w-7xl space-x-8 transition-all duration-500 ease-in-out ${
            isFullScreen ? "h-screen" : "h-auto"
          }`}
        >
          {/* File Upload Box */}
          <div
            className={`flex-1 p-6 border border-gray-200 rounded-lg shadow-md dark:bg-[#343434] dark:border-gray-700 transition-all duration-500 ease-in-out ${
              isFullScreen ? "fixed inset-0 z-50 p-10 px-20" : ""
            }`}
          >
            <h2
              className={`mb-4 items-center justify-center flex text-2xl font-bold text-gray-900 dark:text-black ${
                isFullScreen
                  ? "text-4xl mb-6 flex items-center justify-center"
                  : ""
              }`}
            >
              Upload Your Files
            </h2>
            <div
              className={`rounded-lg shadow-lg flex flex-col items-center justify-between p-2.5 space-y-1.5 bg-[#1e1e1e] transition-all duration-500 ease-in-out ${
                isFullScreen ? "h-[calc(100vh-120px)]" : "h-[300px]"
              }`}
            >
              <div
                className="flex-1 w-full border-2 bg-[#6a6a6a] border-dashed border-[#1f2937] rounded-lg flex flex-col items-center justify-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <svg
                  className="h-24 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15"
                    stroke="#000000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-center text-black">
                  Browse File to upload! or
                </p>
                <a
                  className="text-black underline hover:text-[#444444]"
                  href="#"
                  onClick={handleImportClick}
                >
                  Import From GitHub
                </a>
              </div>
              <label
                htmlFor="file"
                className="w-full h-10 px-2 rounded-lg cursor-pointer flex items-center justify-end text-black bg-[#6a6a6a]"
              >
                <svg
                  className="h-[100%] fill-[#1e1e1e] bg-gray-600 bg-opacity-10 rounded-full p-0.5 cursor-pointer shadow-md"
                  fill="#000000"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.331 6H8.5v20h15V14.154h-8.169z" />
                  <path d="M18.153 6h-.009v5.342H23.5v-.002z" />
                </svg>
                <p className="flex-1 text-center">{getFileNameDisplay()}</p>
                <button onClick={handleDelete} className="focus:outline-none">
                  <svg
                    className="h-8 fill-[#1e1e1e] bg-gray-600 bg-opacity-10 rounded-full p-0.5 cursor-pointer shadow-md"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.16565 10.1534C5.07629 8.99181 5.99473 8 7.15975 8H16.8402C18.0053 8 18.9237 8.9918 18.8344 10.1534L18.142 19.1534C18.0619 20.1954 17.193 21 16.1479 21H7.85206C6.80699 21 5.93811 20.1954 5.85795 19.1534L5.16565 10.1534Z"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <path
                      d="M19.5 5H4.5"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H10V3Z"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </label>
              <input
                id="file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
              />{" "}
            </div>
            {/* Import from GitHub Section */}
            {!isFullScreen && (
              <div className="mt-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-black">
                  Import from GitHub
                </h3>
                <input
                  type="text"
                  placeholder="Enter GitHub Repository URL"
                  className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-[#1e1e1e] dark:text-white"
                />
                <button className="relative flex justify-center mt-4 items-center px-6 py-3 overflow-hidden font-medium transition-all bg-[#1e1e1e] rounded-md group">
                  <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-[#000] rounded group-hover:-mr-4 group-hover:-mt-4">
                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-[#6a6a6a]"></span>
                  </span>
                  <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-[#000] rounded group-hover:-ml-4 group-hover:-mb-4">
                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-[#6a6a6a]"></span>
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-[#000] rounded-md group-hover:translate-x-0"></span>
                  <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                    Import
                  </span>
                </button>
              </div>
            )}
          </div>
          {/* Templates Box */}
          {!isFullScreen && (
            <div className="flex-1 p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-[#343434] dark:border-gray-700 flex flex-col">
              <h2 className="mb-4 text-2xl font-bold items-center justify-center flex text-gray-900 dark:text-black">
                Templates
              </h2>
              <div className="overflow-x-auto flex-grow">
                <div className=" overflow-y-scroll h-[480px]">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-black uppercase bg-[#1e1e1e] dark:[#1e1e1e] dark:text-gray-400 sticky top-0">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Template
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Upload Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Access info
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Link
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-black divide-y dark:divide-[#1e1e1e] dark:bg-[#444444]">
                      {[...Array(20)].map((_, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-100 dark:hover:bg-[#373737]"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            Template {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Category {(index % 3) + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {["Easy", "Medium", "Hard"][index % 3]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-[#000] hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                              Use
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateNewProject;
