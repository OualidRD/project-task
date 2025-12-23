import { useCallback } from 'react';
import { toast, ToastOptions } from 'react-toastify';

export const useToast = () => {
  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', options?: ToastOptions) => {
      toast[type](message, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        ...options,
      });
    },
    []
  );

  return { showToast };
};
