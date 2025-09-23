import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, Platform } from 'react-native';

type Props = { label: string; onPress: () => void; variant?: 'primary'|'secondary'|'danger'; style?: ViewStyle; disabled?: boolean; };
export default function Button({ label, onPress, variant='primary', style, disabled }: Props) {
  const bg = variant==='primary' ? styles.primary : variant==='danger' ? styles.danger : styles.secondary;
  const fg = variant==='secondary' ? styles.textDark : styles.textLight;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: 'rgba(0,0,0,0.15)' }}
      style={({ pressed }) => [ styles.base, bg, pressed && Platform.OS==='ios' ? {opacity:0.9}:null, disabled && {opacity:0.5}, style ]}
    >
      <Text style={[styles.text, fg]}>{label}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  base:{ paddingVertical:14, paddingHorizontal:18, borderRadius:14, alignItems:'center', borderWidth:1, borderColor:'#1f2937' },
  primary:{ backgroundColor:'#2E7D32' },
  secondary:{ backgroundColor:'#111827' },
  danger:{ backgroundColor:'#B00020' },
  text:{ fontSize:16, fontWeight:'700' },
  textLight:{ color:'#fff' },
  textDark:{ color:'#e5e7eb' }
});
