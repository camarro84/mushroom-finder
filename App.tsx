// App.tsx
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { setupI18n } from './src/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './src/storage/keys';
import { ThemeProvider } from './src/theme';

export default function App() {
  const [ready, setReady] = useState(false);
  const [initialRoute, setInitialRoute] =
    useState<'Language' | 'Disclaimer' | 'Tabs' | 'Home'>('Language');

  useEffect(() => {
    (async () => {
      try {
        const lang = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
        setupI18n(lang || undefined);
        const tos = await AsyncStorage.getItem(STORAGE_KEYS.TOS_ACCEPTED);
        if (!lang) setInitialRoute('Language');
        else if (tos === 'true') setInitialRoute('Tabs');
        else setInitialRoute('Disclaimer');
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <RootNavigator key={initialRoute} />
    </ThemeProvider>
  );
}
