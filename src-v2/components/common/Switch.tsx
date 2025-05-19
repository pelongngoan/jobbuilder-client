import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <div className="relative inline-block w-10 h-6">
      <input
        type="checkbox"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="absolute inset-0 bg-gray-300 rounded-full transition-all duration-200"></span>
      <span className="absolute inset-0 bg-white rounded-full transition-all duration-200"></span>
    </div>
  );
};

export default Switch;
