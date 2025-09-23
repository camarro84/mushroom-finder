import React from 'react';
import { useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/MapScreen';
import CatalogScreen from '../screens/CatalogScreen';
import DangerScreen from '../screens/DangerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const bg = isDark ? '#0f0f10' : '#ffffff';
  const border = isDark ? '#252525' : '#e5e5e5';
  const active = '#2E7D32';
  const inactive = isDark ? '#b5b5b5' : '#666666';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: bg, borderTopColor: border },
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Map':
              return <Ionicons name="map-outline" size={size} color={color} />;
            case 'Catalog':
              return <MaterialCommunityIcons name="mushroom-outline" size={size} color={color} />;
            case 'Danger':
              return <Ionicons name="warning-outline" size={size} color={color} />;
            case 'Settings':
              return <Ionicons name="settings-outline" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Catalog" component={CatalogScreen} />
      <Tab.Screen name="Danger" component={DangerScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
