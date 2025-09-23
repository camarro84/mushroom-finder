import React, { useState } from 'react';
import { Text, Alert } from 'react-native';
import Screen from '../components/Screen';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../storage/keys';
import Loader from '../components/Loader';

export default function DisclaimerScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  const accept = async () => {
    try {
      setBusy(true);
      await AsyncStorage.setItem(STORAGE_KEYS.TOS_ACCEPTED, 'true');
      navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
    } catch {
      setBusy(false);
      Alert.alert('Error', 'Failed to save consent. Please try again.');
    }
  };

  const decline = () => {
    Alert.alert(t('disclaimer.title'), t('disclaimer.declineMsg'));
  };

  return (
    <Screen>
      <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-4">
        {t('disclaimer.title')}
      </Text>
      <Text className="text-base leading-5 text-neutral-600 dark:text-neutral-300 text-center">
        {t('disclaimer.text')}
      </Text>

      <Button label={t('disclaimer.accept')} onPress={accept} style={{ marginTop: 16 }} />
      <Button variant="secondary" label={t('disclaimer.decline')} onPress={decline} style={{ marginTop: 8 }} />
      <Loader visible={busy} text="Saving..." />
    </Screen>
  );
}
