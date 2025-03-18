import { toast } from 'react-toastify';

/**
 * ✅ Show a success notification
 */
export const showSuccessNotification = (message: string) => {
  toast.success(`✅ ${message}`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

/**
 * ❌ Show an error notification
 */
export const showErrorNotification = (message: string) => {
  toast.error(`❌ ${message}`, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

/**
 * 📢 Show an informational notification
 */
export const showInfoNotification = (message: string) => {
  toast.info(`ℹ️ ${message}`, {
    position: "top-right",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

/**
 * ⚠️ Show a warning notification
 */
export const showWarningNotification = (message: string) => {
  toast.warn(`⚠️ ${message}`, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};