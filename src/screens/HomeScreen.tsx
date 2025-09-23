import React from 'react';
import { Text } from 'react-native';
import Screen from '../components/Screen';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();
  return (
    <Screen>
      <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-3">
        {t('home.title')}
      </Text>
      <Text className="text-neutral-600 dark:text-neutral-300 text-center">
        Starter screen. After MVP we add Tabs: Map / Catalog / Danger / Settings.
      </Text>
    </Screen>
  );
}
