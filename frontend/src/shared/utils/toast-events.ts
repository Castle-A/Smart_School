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

    success(message: string) {
        this.emit('success', message);
    }

    error(message: string) {
        this.emit('error', message);
    }

    info(message: string) {
        this.emit('info', message);
    }

    warning(message: string) {
        this.emit('warning', message);
    }
}

export const toastEvents = new ToastEventEmitter();
