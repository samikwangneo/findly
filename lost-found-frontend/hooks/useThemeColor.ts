import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useThemeColor(
  colorName: ColorName,
  props?: { light?: string; dark?: string },
  useOpacity?: boolean
): string {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props && props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}