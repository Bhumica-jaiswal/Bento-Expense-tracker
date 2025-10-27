import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiX, FiCheckCircle } from 'react-icons/fi';
import api from '../api/axios';

const BudgetAlertToast = () => {
  const [toasts, setToasts] = useState([]);
  const [previousAlerts, setPreviousAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/budgets/alerts');
      const currentAlerts = response.data.alerts || [];
      
      // Check for new alerts
      const newAlerts = currentAlerts.filter(alert => 
        !previousAlerts.some(prevAlert => 
          prevAlert.category === alert.category && 
          prevAlert.type === alert.type &&
          prevAlert.spent === alert.spent
        )
      );

      // Add new alerts as toasts
      newAlerts.forEach(alert => {
        addToast(alert);
      });

      setPreviousAlerts(currentAlerts);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const addToast = (alert) => {
    const toastId = Date.now() + Math.random();
    const newToast = {
      id: toastId,
      ...alert,
      timestamp: new Date()
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after 8 seconds
    setTimeout(() => {
      removeToast(toastId);
    }, 8000);
  };

  const removeToast = (toastId) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  };

  useEffect(() => {
    // Initial fetch
    fetchAlerts();
    
    // Check for new alerts every 10 seconds
    const interval = setInterval(fetchAlerts, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const getToastIcon = (type) => {
    if (type === 'exceeded') {
      return <FiAlertTriangle className="h-5 w-5 text-red-500" />;
    }
    return <FiCheckCircle className="h-5 w-5 text-yellow-500" />;
  };

  const getToastBgColor = (type) => {
    return type === 'exceeded' 
      ? 'bg-red-900/90 border-red-500/50' 
      : 'bg-yellow-900/90 border-yellow-500/50';
  };

  const getToastTextColor = (type) => {
    return type === 'exceeded' ? 'text-red-100' : 'text-yellow-100';
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastBgColor(toast.type)} ${getToastTextColor(toast.type)} border rounded-lg p-4 shadow-lg backdrop-blur-sm min-w-80 max-w-96 transform transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-start space-x-3">
            {getToastIcon(toast.type)}
            <div className="flex-1">
              <div className="font-semibold text-sm">
                {toast.category} Budget {toast.type === 'exceeded' ? 'Exceeded!' : 'Warning!'}
              </div>
              <div className="text-xs mt-1 opacity-90">
                {toast.message}
              </div>
              <div className="text-xs mt-1 opacity-75">
                {toast.period} • {toast.percentageUsed}% used
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BudgetAlertToast;

