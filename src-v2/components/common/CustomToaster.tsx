import { Toaster } from "react-hot-toast";

interface CustomToasterProps {
  position?:
    | "top-right"
    | "top-center"
    | "top-left"
    | "bottom-right"
    | "bottom-center"
    | "bottom-left";
  duration?: number;
  success?: {
    duration?: number;
  };
  error?: {
    duration?: number;
  };
}

export const CustomToaster = ({
  position = "top-right",
}: CustomToasterProps) => {
  return (
    <Toaster
      position={position}
      toastOptions={{
        success: { duration: 3000 },
        error: { duration: 3000 },
      }}
    />
  );
};

export default CustomToaster;
