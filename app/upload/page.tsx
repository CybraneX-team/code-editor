"use client";

import React, { useState, useCallback } from "react";
import "./uploadPage.css";
import RegistrationForm from "@/components/SignUp";
import Login from "@/components/Login";

const CreateNewProject: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };
  const toggleForm = () => {
    setShowLogin(!showLogin);
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
        className={`flex flex-col items-center justify-center transition-all duration-500 ease-in-out
        }`}
      >
        {/* <h1 className="mb-8 mt-8 text-4xl font-extrabold text-black dark:text-white">
          Create a New Project
        </h1> */}
        <div
          className={`flex py-8 w-full h-screen max-w-7xl space-x-8 transition-all duration-500 ease-in-out           }`}
        >
          {/* File Upload Box */}
          <div
            className={`flex-1 p-6 border border-gray-200 rounded-lg shadow-md dark:bg-[#343434] dark:border-gray-700 transition-all duration-500 ease-in-out            }`}
          >
            <h2
              className={`mb-4 items-center mt-4 justify-center flex text-2xl font-bold text-gray-900 dark:text-white 
              }`}
            >
              Upload Your Files
            </h2>
            <div
              className={`rounded-lg shadow-lg flex flex-col items-center justify-between p-2.5 space-y-1.5 bg-[#1e1e1e] transition-all duration-500 ease-in-out h-[350px] `}
            >
              <div
                className="flex-1 w-full border-2 bg-[#444444] border-dashed border-[#1f2937] rounded-lg flex flex-col items-center justify-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >

                  <svg className="text-6xl text-black" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><polyline points="16 16 12 12 8 16"></polyline><line y2="21" x2="12" y1="12" x1="12"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
                <p className="text-center text-black">
                  Browse File to upload!
                </p>
                <a
                  className={`text-black underline hover:text-blue `}
                  href="#"
                  onClick={handleImportClick}
                >
                  Import From GitHub
                </a>
              </div>
              <label
                htmlFor="file"
                className="w-full h-10 px-2 rounded-lg cursor-pointer flex items-center justify-end text-black bg-[#444444]"
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
              <div className="mt-8 login-button">
                {/* <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-black">
                  Import from GitHub
                </h3>
                <input
                  type="text"
                  placeholder="Enter GitHub Repository URL"
                  className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-[#1e1e1e] dark:text-white"
                />
                <button className="relative flex justify-center mt-4 items-center px-6 py-3 overflow-hidden font-medium transition-all bg-[#1e1e1e] rounded-md group">
                  <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-[#000] rounded group-hover:-mr-4 group-hover:-mt-4">
                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-[#343434]"></span>
                  </span>
                  <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-[#000] rounded group-hover:-ml-4 group-hover:-mb-4">
                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-[#343434]"></span>
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-[#000] rounded-md group-hover:translate-x-0"></span>
                  <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                    Import
                  </span>
                </button> */}
                <button className="button ml-36"> 
                  <svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <title>github</title> <rect fill="none" height="24" width="24"></rect> <path d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z"></path> </g></svg>
                  Continue with Github 
                </button>
                <button className="button ml-36"> 
                <svg
                  className="h-[20px]"
                  viewBox="0 0 256 262"
                  preserveAspectRatio="xMidYMid"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    fill="#EB4335"
                  ></path>
                </svg>                 
                Continue with Google 
                </button>
              </div>
          </div>
          {showLogin ? (
          <Login toggleForm={toggleForm} />
        ) : (
          <RegistrationForm toggleForm={toggleForm} />
        )}
          {/* Templates Box */}
            <div className="flex-1 p-6 mt-56 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-[#343434] dark:border-gray-700 flex flex-col">
              <h2 className="mb-4 text-2xl font-bold items-center justify-center flex text-gray-900 dark:text-white">
                Templates
              </h2>
              <div className="overflow-x-auto flex-grow">
                <div className=" overflow-y-scroll h-[300px]">
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
        </div>
      </div>
    </div>
  );
};

export default CreateNewProject;
