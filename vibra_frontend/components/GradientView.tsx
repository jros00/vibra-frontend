import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

type GradientViewProps = {
  style?: object;
  children?: React.ReactNode;
};

export function GradientView({ style, children }: GradientViewProps) {
  const theme = useColorScheme() ?? 'light';
  const gradientStart = Colors[theme].gradientStart;
  const gradientEnd = Colors[theme].gradientEnd;

  return (
    <LinearGradient
      colors={[gradientStart, gradientEnd]}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}
