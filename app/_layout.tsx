import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/lib/contexts/ToastContext';
import { ErrorBoundary } from '@/components/atoms/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ToastProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </ToastProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
