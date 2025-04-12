import { useState } from "react";
import { Sun, Moon, Palette, X, Briefcase } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export const ThemeSwitcher = () => {
  const { appearance, toggleAppearance, variant, setVariant } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const variants = [
    { id: "career", name: "Career", icon: <Briefcase size={16} /> },
    { id: "professional", name: "Professional", icon: null },
    { id: "modern", name: "Modern", icon: null },
    { id: "minimal", name: "Minimal", icon: null },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-theme-primary text-theme-secondary hover:bg-theme-secondary transition-colors"
        aria-label="Theme settings"
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-theme-primary border border-theme z-10">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-theme-secondary border-b border-theme">
              Theme Settings
            </div>

            <div className="px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-theme-secondary">Dark Mode</span>
                <button
                  onClick={toggleAppearance}
                  className="p-1 rounded-full bg-theme-secondary text-theme-primary hover:bg-theme-primary hover:text-theme-secondary transition-colors"
                >
                  {appearance === "light" ? (
                    <Moon size={16} />
                  ) : (
                    <Sun size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="px-4 py-2">
              <div className="text-sm text-theme-secondary mb-2">
                Theme Variant
              </div>
              <div className="space-y-1">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() =>
                      setVariant(
                        v.id as "professional" | "modern" | "minimal" | "career"
                      )
                    }
                    className={`w-full text-left px-2 py-1 text-sm rounded flex items-center ${
                      variant === v.id
                        ? "bg-primary-600 text-white"
                        : "text-theme-secondary hover:bg-theme-secondary"
                    }`}
                  >
                    {v.icon && <span className="mr-2">{v.icon}</span>}
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 py-2 border-t border-theme">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center text-sm text-theme-secondary hover:text-theme-primary"
              >
                <X size={16} className="mr-1" />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
