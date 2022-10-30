import React from "react";

// solid button
interface SolidProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export const Solid = ({ children, onClick, className = "" }: SolidProps) => {
  return (
    <button onClick={onClick} className={`button-solid ${className}`}>
      {children}
    </button>
  );
};

// outlined button
interface OutlinedProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  color: "blue" | "red" | "green" | "gray";
  disabled?: boolean;
}

export const Outlined = ({
  children,
  color,
  className = "",
  onClick,
  disabled = false,
}: OutlinedProps) => {
  return (
    <button
      onClick={onClick}
      className={`button-outlined button-${color} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
