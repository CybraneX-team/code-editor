import React from "react";

interface OutputDetails {
  status?: { id: number };
  compile_output?: string;
  stdout?: string;
  stderr?: string;
}

const OutputWindow: React.FC<{ outputDetails: OutputDetails }> = ({ outputDetails }) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      return (
        <pre className="px-2 py-1 text-xs text-red-500">
          {atob(outputDetails?.compile_output!)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="px-2 py-1 text-xs text-green-500">
          {outputDetails.stdout !== null ? `${atob(outputDetails.stdout!)}` : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="px-2 py-1 text-xs text-red-500">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      return (
        <pre className="px-2 py-1 text-xs text-red-500">
          {outputDetails?.stderr ? `${atob(outputDetails?.stderr!)}` : ''}
        </pre>
      );
    }
  };

  return (
    <div>
      <h1 className="font-bold text-xl mb-2">Output</h1>
      <div className="w-full h-56 bg-gray-800 text-white text-sm overflow-y-auto rounded-md p-2">
        {outputDetails ? <>{getOutput()}</> : null}
      </div>
    </div>
  );
};

export default OutputWindow;
