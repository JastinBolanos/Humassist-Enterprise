export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: ToastType;
}
