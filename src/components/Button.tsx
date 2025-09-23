import React from 'react';
import { Pressable, Text, Platform, ViewStyle } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  style?: ViewStyle;
  disabled?: boolean;
};

function classes(variant: Variant, size: Size) {
  const base = 'items-center rounded-2xl border';
  const sizes: Record<Size, string> = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3.5 px-4 text-base',
    lg: 'py-4 px-6 text-lg',
  };
  const variants: Record<Variant, string> = {
    primary: 'bg-brand border-brand',
    secondary: 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700',
    ghost: 'bg-transparent border-neutral-300 dark:border-neutral-700',
    danger: 'bg-danger border-danger',
  };
  const text: Record<Variant, string> = {
    primary: 'text-white',
    secondary: 'text-neutral-900 dark:text-neutral-100',
    ghost: 'text-neutral-900 dark:text-neutral-100',
    danger: 'text-white',
  };
  return {
    container: `${base} ${sizes[size]} ${variants[variant]}`,
    text: `font-bold ${text[variant]}`,
  };
}

export default function Button({ label, onPress, variant='primary', size='md', style, disabled }: Props) {
  const cls = classes(variant, size);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: 'rgba(0,0,0,0.15)' }}
      className={`${cls.container} ${disabled ? 'opacity-50' : ''}`}
      style={({ pressed }) => [{ opacity: pressed && Platform.OS === 'ios' ? 0.85 : 1 }, style]}
    >
      <Text className={cls.text}>{label}</Text>
    </Pressable>
  );
}
