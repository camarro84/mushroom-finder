import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/MapScreen';
import CatalogScreen from '../screens/CatalogScreen';
import DangerScreen from '../screens/DangerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import IdentifyScreen from '../screens/IdentifyScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#2E7D32',
      tabBarInactiveTintColor: '#6b7280'
    }}>
      <Tab.Screen name="Map" component={MapScreen}
        options={{ title: t('tabs.map'), tabBarIcon: ({color, size}) => <Ionicons name="map-outline" size={size} color={color} /> }} />
      <Tab.Screen name="Catalog" component={CatalogScreen}
        options={{ title: t('tabs.catalog'), tabBarIcon: ({color, size}) => <MaterialCommunityIcons name="mushroom-outline" size={size} color={color} /> }} />
      <Tab.Screen name="Identify" component={IdentifyScreen}
        options={{ title: t('tabs.identify'), tabBarIcon: ({color, size}) => <Ionicons name="camera-outline" size={size} color={color} /> }} />
      <Tab.Screen name="Danger" component={DangerScreen}
        options={{ title: t('tabs.danger'), tabBarIcon: ({color, size}) => <Ionicons name="warning-outline" size={size} color={color} /> }} />
      <Tab.Screen name="Settings" component={SettingsScreen}
        options={{ title: t('tabs.settings'), tabBarIcon: ({color, size}) => <Ionicons name="settings-outline" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}
