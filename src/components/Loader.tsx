import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function Loader({ visible, text }: { visible: boolean; text?: string }) {
  if (!visible) return null;
  return (
    <View className="absolute inset-0 items-center justify-center bg-black/60">
      <ActivityIndicator size="large" />
      {!!text && <Text className="text-white mt-2">{text}</Text>}
    </View>
  );
}
