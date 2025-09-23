import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../storage/keys';

// Импорт через require, чтобы избежать придирок TS к типам в некоторых версиях.
const { NativeWindStyleSheet } = require('nativewind');

export type ThemeMode = 'light' | 'dark' | 'system';

type Ctx = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => Promise<void>;
  toggle: () => Promise<void>;
};

const ThemeCtx = createContext<Ctx | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const osScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'light' || saved === 'dark' || saved === 'system') setModeState(saved);
    })();
  }, []);

  useEffect(() => {
    const effective = mode === 'system' ? (osScheme === 'dark' ? 'dark' : 'light') : mode;
    NativeWindStyleSheet?.setColorScheme?.(effective);
  }, [mode, osScheme]);

  const setMode = async (m: ThemeMode) => {
    setModeState(m);
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, m);
  };

  const toggle = async () => {
    const next: ThemeMode = mode === 'light' ? 'dark' : 'light';
    await setMode(next);
  };

  return (
    <ThemeCtx.Provider value={{ mode, setMode, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
};

export function useThemeMode() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProvider');
  return ctx;
}
