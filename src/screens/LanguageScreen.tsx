import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../storage/keys';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';

export default function LanguageScreen({ navigation }: any) {
  const { t } = useTranslation();
  const setLang = async (lng: 'en'|'ua'|'pl'|'ru') => {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lng);
    i18n.changeLanguage(lng);
    navigation.replace('Disclaimer');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('lang.title')}</Text>
      <View style={styles.grid}>
        <Button label={t('lang.english')} onPress={()=>setLang('en')} />
        <Button label={t('lang.ukrainian')} onPress={()=>setLang('ua')} />
        <Button label={t('lang.polish')} onPress={()=>setLang('pl')} />
        <Button label={t('lang.russian')} onPress={()=>setLang('ru')} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0A0A0A', padding:24, justifyContent:'center' },
  title:{ color:'#fff', fontSize:22, fontWeight:'800', textAlign:'center', marginBottom:24 },
  grid:{ gap:12 }
});
