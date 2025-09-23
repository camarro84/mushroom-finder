import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../storage/keys';

export default function DisclaimerScreen({ navigation }: any) {
  const { t } = useTranslation();
  const accept = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.TOS_ACCEPTED, 'true');
    navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
  };
  const decline = () => Alert.alert(t('disclaimer.title'), t('disclaimer.declineMsg'));
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('disclaimer.title')}</Text>
      <Text style={styles.text}>{t('disclaimer.text')}</Text>
      <View style={{ height: 16 }} />
      <Button label={t('disclaimer.accept')} onPress={accept} />
      <View style={{ height: 8 }} />
      <Button variant="secondary" label={t('disclaimer.decline')} onPress={decline} />
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0A0A0A', padding:24, justifyContent:'center' },
  title:{ color:'#fff', fontSize:22, fontWeight:'800', textAlign:'center', marginBottom:16 },
  text:{ color:'#d1d5db', fontSize:16, lineHeight:22 }
});
