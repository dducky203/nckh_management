import { createContext, useContext, useState, useMemo } from 'react';

import ToastNotification from '../components/common/ToastNotification';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Xử lý nhiều toast cùng lúc
  const showToast = (message, type = 'success', duration = 3000, position = {
    vertical: 'top',
    horizontal: 'right',
  }) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration, position }]);
    return id;
  };

  const hideToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  // Helper methods
  const success = (message, duration, position) => 
    showToast(message, 'success', duration, position);
    
  const error = (message, duration, position) => 
    showToast(message, 'error', duration, position);
    
  const warning = (message, duration, position) => 
    showToast(message, 'warning', duration, position);
    
  const info = (message, duration, position) => 
    showToast(message, 'info', duration, position);

  // Điều chỉnh vị trí của nhiều toast để không chồng lên nhau
  const adjustedToasts = useMemo(() => {
    return toasts.map((toast, index) => {
      // Điều chỉnh vị trí khi có nhiều toast
      if (toasts.length > 1) {
        const position = { ...toast.position };
        if (position.vertical === 'bottom') {
          position.vertical = 'bottom';
        } 
        return { ...toast, position };
      }
      return toast;
    });
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, success, error, warning, info }}>
      {children}
      {adjustedToasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};