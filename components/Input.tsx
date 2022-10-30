import React from "react";
import { CloudArrowDownIcon } from "@heroicons/react/24/outline";

// normal input
interface NormalProps {
  type: "email" | "text" | "password";
  placeholder: string;
  value?: string | number;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Normal = ({
  type,
  placeholder,
  value,
  className = "",
  onChange,
}: NormalProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`input-normal ${className}`}
      onChange={onChange}
      value={value}
    />
  );
};

// file input
interface FileProps {
  children: React.ReactNode;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const File = ({ children, onChange }: FileProps) => {
  return (
    <div className="input-file">
      <div className="input-file-icon">
        <CloudArrowDownIcon className="h-8" />
      </div>
      {children}
      <input type={"file"} onChange={onChange} />
    </div>
  );
};

// textarea
// interface TextareaProps {

// }
