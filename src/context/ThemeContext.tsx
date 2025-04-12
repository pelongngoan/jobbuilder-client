import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type ThemeVariant = "professional" | "modern" | "minimal" | "career";
type ThemeAppearance = "light" | "dark";

interface ThemeContextType {
  variant: ThemeVariant;
  primary: string;
  appearance: ThemeAppearance;
  radius: number;
  setVariant: (variant: ThemeVariant) => void;
  setPrimary: (primary: string) => void;
  setAppearance: (appearance: ThemeAppearance) => void;
  setRadius: (radius: number) => void;
  toggleAppearance: () => void;
}

const defaultTheme = {
  variant: "career" as ThemeVariant,
  primary: "hsl(222, 47%, 31%)", // A professional blue color
  appearance: "light" as ThemeAppearance,
  radius: 0.5,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState(defaultTheme);

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
      } catch (error) {
        console.error("Failed to parse saved theme:", error);
      }
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));

    // Apply theme to document
    document.documentElement.style.setProperty("--primary", theme.primary);
    document.documentElement.style.setProperty(
      "--radius",
      `${theme.radius}rem`
    );
    document.documentElement.setAttribute("data-theme", theme.appearance);
    document.documentElement.setAttribute("data-variant", theme.variant);
  }, [theme]);

  const setVariant = (variant: ThemeVariant) => {
    setTheme((prev) => ({ ...prev, variant }));
  };

  const setPrimary = (primary: string) => {
    setTheme((prev) => ({ ...prev, primary }));
  };

  const setAppearance = (appearance: ThemeAppearance) => {
    setTheme((prev) => ({ ...prev, appearance }));
  };

  const setRadius = (radius: number) => {
    setTheme((prev) => ({ ...prev, radius }));
  };

  const toggleAppearance = () => {
    setTheme((prev) => ({
      ...prev,
      appearance: prev.appearance === "light" ? "dark" : "light",
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        ...theme,
        setVariant,
        setPrimary,
        setAppearance,
        setRadius,
        toggleAppearance,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
