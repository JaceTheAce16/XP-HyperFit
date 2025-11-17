import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing } from '@/theme';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

/**
 * ToastProvider - Global toast notification system
 * Shows temporary messages for user feedback
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3000) => {
      const id = Date.now().toString();
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.toastContainer}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const [opacity] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(toast.duration - 400),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getToastStyle = () => {
    switch (toast.type) {
      case 'success':
        return { backgroundColor: colors.success.main };
      case 'error':
        return { backgroundColor: colors.error.main };
      case 'warning':
        return { backgroundColor: colors.warning.main };
      default:
        return { backgroundColor: colors.primary.main };
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <Animated.View
      style={[styles.toast, getToastStyle(), { opacity }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.toastIcon}>{getIcon()}</Text>
      <Text style={styles.toastMessage}>{toast.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
    gap: spacing.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastIcon: {
    fontSize: typography.fontSize.xl,
    color: '#FFF',
    marginRight: spacing.sm,
    fontWeight: typography.fontWeight.bold,
  },
  toastMessage: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: '#FFF',
    fontWeight: typography.fontWeight.medium,
  },
});
