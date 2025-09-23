import React from 'react';
import { ViewStyle, ScrollView, RefreshControl, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export default function Screen({ children, style, scroll, refreshing, onRefresh }: Props) {
  const scheme = useColorScheme();
  const barStyle = scheme === 'dark' ? 'light' : 'dark';

  if (scroll) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
        <StatusBar style={barStyle as any} />
        <ScrollView
          className="flex-1"
          contentContainerStyle={[{ padding: 20 }, style]}
          showsVerticalScrollIndicator={false}
          refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} /> : undefined}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <StatusBar style={barStyle as any} />
      <View className="flex-1 p-5" style={style}>
        {children}
      </View>
    </SafeAreaView>
  );
}
