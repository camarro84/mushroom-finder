import React from 'react';
import { Text, View } from 'react-native';
import Screen from '../components/Screen';
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
    <Screen>
      <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-6">
        {t('lang.title')}
      </Text>
      <View className="gap-3">
        <Button label={t('lang.english')} onPress={()=>setLang('en')} />
        <Button label={t('lang.ukrainian')} onPress={()=>setLang('ua')} />
        <Button label={t('lang.polish')} onPress={()=>setLang('pl')} />
        <Button label={t('lang.russian')} onPress={()=>setLang('ru')} />
      </View>
    </Screen>
  );
}
