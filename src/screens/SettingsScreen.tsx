import React from 'react';
import { Text, View } from 'react-native';
import Screen from '../components/Screen';
import Button from '../components/Button';
import { useThemeMode, ThemeMode } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../storage/keys';

export default function SettingsScreen({ navigation }: any) {
  const { mode, setMode } = useThemeMode();

  const resetConsent = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.LANGUAGE);
    await AsyncStorage.removeItem(STORAGE_KEYS.TOS_ACCEPTED);
    navigation.reset({ index: 0, routes: [{ name: 'Language' }] });
  };

  const setThemeMode = (m: ThemeMode) => setMode(m);

  return (
    <Screen>
      <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-4">Settings</Text>

      <Text className="text-xs font-bold text-neutral-600 dark:text-neutral-300 mb-2">Theme</Text>
      <View className="flex-row gap-2">
        <Button variant={mode==='light' ? 'primary' : 'secondary'} label="Light"  onPress={()=>setThemeMode('light')} />
        <Button variant={mode==='dark'  ? 'primary' : 'secondary'} label="Dark"   onPress={()=>setThemeMode('dark')} />
        <Button variant={mode==='system'? 'primary' : 'secondary'} label="System" onPress={()=>setThemeMode('system')} />
      </View>

      <Text className="text-xs font-bold text-neutral-600 dark:text-neutral-300 mt-6 mb-2">Consent</Text>
      <Button variant="secondary" label="Change Language / Reset Consent" onPress={resetConsent} />
    </Screen>
  );
}
