import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  showSuccessToast(text: string) {
    this.show(text, { classname: 'bg-success text-light', delay: 3000 });
  }

  showError(text: string) {
    this.show(text, { classname: 'bg-danger text-light', delay: 3000 });
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
