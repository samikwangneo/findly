// ThemedView.tsx
import { View, type ViewProps } from 'react-native';
import { Colors } from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  // Use the background color from Colors instead of hardcoding
  const backgroundColor = '#11181C'

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}