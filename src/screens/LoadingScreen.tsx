import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function LoadingScreen({ navigation }: any) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/splash.png')} style={styles.logo} resizeMode="contain" />
      <ActivityIndicator size="large" color="#2E7D32" />
      <Text style={styles.text}>{t('loading.title')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0A', alignItems:'center', justifyContent:'center', padding:24 },
  logo: { width: 200, height: 200, marginBottom: 20 },
  text: { marginTop: 8, color:'#d1d5db', fontWeight:'700' }
});
