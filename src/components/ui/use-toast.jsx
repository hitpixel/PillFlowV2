import React, { createContext, useContext, useState, useCallback } from 'react';

// Create a context for the toast
const ToastContext = createContext(null);

// Toast variants
const variants = {
  default: 'bg-white border-gray-200 text-gray-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  destructive: 'bg-red-50 border-red-200 text-red-800',
};

// Toast component
const Toast = ({ toast, onClose }) => {
  const { title, description, variant = 'default' } = toast;
  
  return (
    <div className={`rounded-md border p-4 shadow-md ${variants[variant]}`}>
      <div className="flex justify-between items-start">
        <div>
          {title && <h3 className="font-medium">{title}</h3>}
          {description && <p className="text-sm mt-1">{description}</p>}
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default', duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    if (duration !== Infinity) {
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
      }, duration);
    }
    
    return id;
  }, []);

  const closeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-6 space-y-4 z-50 max-w-md">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => closeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook to use the toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 