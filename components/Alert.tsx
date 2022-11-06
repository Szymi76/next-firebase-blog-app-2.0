import React, { useEffect } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";

interface AlertProps {
  label: string | null;
  restore: () => void;
}

const Alert = ({ label, restore }: AlertProps) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      restore();
    }, 3000);

    timeout;

    return () => clearTimeout(timeout);
  }, [label]);

  return (
    <>
      {label && (
        <div className="alert fixed left-0 z-30 w-full grid place-items-center cursor-pointer">
          <div className="bg-white rounded-md shadow-md p-3 flex items-center space-x-2">
            <p className="text-lg">{label}</p>
            <CheckIcon className="h-5 text-green-600" />
          </div>
        </div>
      )}
    </>
  );
};

export default Alert;
