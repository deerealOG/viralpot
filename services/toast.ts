import { ToastType } from '../components/Toast';

type ToastEvent = CustomEvent<{ message: string; type: ToastType }>;

export const toast = {
  show: (message: string, type: ToastType = 'info') => {
    const event = new CustomEvent('show-toast', {
      detail: { message, type }
    }) as ToastEvent;
    window.dispatchEvent(event);
  },
  success: (message: string) => toast.show(message, 'success'),
  error: (message: string) => toast.show(message, 'error'),
  info: (message: string) => toast.show(message, 'info'),
};
