import React from 'react';

interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false 
}) => {
  const baseStyle = "px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] shadow-gray-400/50",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 border-gray-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 border dark:border-zinc-700",
    outline: "bg-transparent text-gray-900 border-2 border-gray-900 hover:bg-gray-100 dark:text-white dark:border-white dark:hover:bg-white/10"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};