import React from 'react';
import { Text } from 'react-native';
import Screen from '../components/Screen';

export default function CatalogScreen() {
  return (
    <Screen>
      <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-2">Catalog</Text>
      <Text className="text-neutral-600 dark:text-neutral-300 text-center">
        Here will be the mushrooms database (SQLite) with filters.
      </Text>
    </Screen>
  );
}
