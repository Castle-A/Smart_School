type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastEvent {
    message: string;
    type: ToastType;
}

type Listener = (event: ToastEvent) => void;

class ToastEventEmitter {
    private listeners: Listener[] = [];

    subscribe(listener: Listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    emit(type: ToastType, message: string) {
        this.listeners.forEach(listener => listener({ type, message }));
    }
}

export const toastEvents = new ToastEventEmitter();
