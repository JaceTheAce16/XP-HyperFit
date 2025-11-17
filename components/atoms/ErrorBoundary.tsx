import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '@/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - Catches React errors and shows friendly fallback UI
 * Prevents app crashes and allows recovery
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // In production, send to error tracking service (e.g., Sentry)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😕</Text>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            We've encountered an unexpected error. Don't worry, your data is safe.
          </Text>
          {__DEV__ && this.state.error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{this.state.error.message}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.dark.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.lg,
    color: colors.dark.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.lineHeight.normal * typography.fontSize.lg,
  },
  errorBox: {
    backgroundColor: colors.dark.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.xl,
    width: '100%',
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error.main,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary.contrast,
  },
});
