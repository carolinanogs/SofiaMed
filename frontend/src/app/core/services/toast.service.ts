import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast = signal<ToastMessage>({ message: '', type: 'info', visible: false });
  private timer: any;

  show(message: string, type: ToastMessage['type'] = 'info', duration = 2800) {
    clearTimeout(this.timer);
    this.toast.set({ message, type, visible: true });
    this.timer = setTimeout(() => {
      this.toast.set({ message: '', type: 'info', visible: false });
    }, duration);
  }
}
