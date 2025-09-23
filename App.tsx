import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import RootNavigator from './src/navigation/RootNavigator';
import { setupI18n } from './src/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './src/storage/keys';

SplashScreen.preventAutoHideAsync().catch(()=>{});

export default function App() {
  const [ready, setReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<'Language'|'Disclaimer'|'Tabs'>('Language');

  useEffect(() => {
    (async () => {
      try {
        const lang = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
        setupI18n(lang || undefined);
        const tos = await AsyncStorage.getItem(STORAGE_KEYS.TOS_ACCEPTED);
        if (!lang) setInitialRoute('Language');
        else if (tos !== 'true') setInitialRoute('Disclaimer');
        else setInitialRoute('Tabs');
      } finally {
        setReady(true);
        setTimeout(() => SplashScreen.hideAsync().catch(()=>{}), 200);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#0A0A0A' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <RootNavigator initialRouteName={initialRoute} />;
}
