import { toast } from "react-hot-toast";

export const useToast = () => {
  const success = (message: string) => {
    // toast.success(message);
  };

  const error = (message: string) => {
    toast.error(message);
  };

  return { success, error };
};

export default useToast;
