import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import LanguageScreen from '../screens/LanguageScreen';
import DisclaimerScreen from '../screens/DisclaimerScreen';
import MainTabs from './MainTabs';

export type RootStackParamList = {
  Language: undefined;
  Disclaimer: undefined;
  Tabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator({ initialRouteName }: { initialRouteName: keyof RootStackParamList }) {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="Disclaimer" component={DisclaimerScreen} />
        <Stack.Screen name="Tabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
