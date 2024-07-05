import React from "react";

interface OutputDetailsProps {
  outputDetails: {
    status?: { description: string };
    memory?: string;
    time?: string;
  };
}

const OutputDetails: React.FC<OutputDetailsProps> = ({ outputDetails }) => {
  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm">
        Status:{" "}
        <span className="font-semibold px-2 py-1 rounded-md bg-gray-100 text-black">
          {outputDetails?.status?.description}
        </span>
      </p>
      <p className="text-sm">
        Memory:{" "} 
        <span className="font-semibold px-2 py-1 rounded-md bg-gray-100 text-black">
          {parseInt(outputDetails?.memory || "0") / 1000} MB
        </span>
      </p>
      <p className="text-sm">
        Time:{" "}
        <span className="font-semibold px-2 py-1 rounded-md bg-gray-100 text-black">
          {outputDetails?.time} s
        </span>
      </p>
    </div>
  );
};

export default OutputDetails;
