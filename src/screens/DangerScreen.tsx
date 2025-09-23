import React from 'react';
import { Text } from 'react-native';
import Screen from '../components/Screen';

export default function DangerScreen() {
  return (
    <Screen>
      <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-2">
        Dangerous mushrooms in your region
      </Text>
      <Text className="text-neutral-600 dark:text-neutral-300 text-center">
        We will detect region and show dangerous look-alikes with tips.
      </Text>
    </Screen>
  );
}
