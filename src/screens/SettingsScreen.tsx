import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../storage/keys';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [spotsVisible, setSpotsVisible] = useState(true);
  const [haptics, setHaptics] = useState(true);

  useEffect(() => {
    (async () => {
      setSpotsVisible((await AsyncStorage.getItem(STORAGE_KEYS.SPOTS_VISIBLE)) !== 'false');
      setHaptics((await AsyncStorage.getItem(STORAGE_KEYS.HAPTICS_ENABLED)) !== 'false');
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings.title')}</Text>

      <View style={styles.row}>
        <Text style={styles.rowText}>{t('settings.spotsVisibility')}</Text>
        <Switch value={spotsVisible} onValueChange={async v=>{ setSpotsVisible(v); await AsyncStorage.setItem(STORAGE_KEYS.SPOTS_VISIBLE, String(v)); }} />
      </View>
      <View style={styles.row}>
        <Text style={styles.rowText}>{t('settings.haptics')}</Text>
        <Switch value={haptics} onValueChange={async v=>{ setHaptics(v); await AsyncStorage.setItem(STORAGE_KEYS.HAPTICS_ENABLED, String(v)); }} />
      </View>

      <View style={{height:20}} />
      <Text style={[styles.section]}>Language</Text>
      <View style={{flexDirection:'row', gap:8, flexWrap:'wrap'}}>
        {(['en','ua','pl','ru'] as const).map(code => (
          <TouchableOpacity key={code} onPress={async()=>{
            await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, code);
            i18n.changeLanguage(code);
            Alert.alert('Language changed', 'Restart the app to apply everywhere.');
          }} style={styles.langBtn}>
            <Text style={{color:'#fff', fontWeight:'700'}}>{code.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{height:20}} />
      <TouchableOpacity
        onPress={async ()=>{
          await AsyncStorage.removeItem(STORAGE_KEYS.TOS_ACCEPTED);
          Alert.alert('Consent reset', 'You will see the disclaimer next launch.');
        }}
        style={[styles.bigBtn,{backgroundColor:'#111827'}]}
      >
        <Text style={{color:'#fff', fontWeight:'800'}}>{t('settings.resetConsent')}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0A0A0A', padding:16 },
  title:{ color:'#fff', fontSize:20, fontWeight:'800', marginBottom:12, textAlign:'center' },
  row:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:12 },
  rowText:{ color:'#d1d5db', fontSize:16 },
  section:{ color:'#9ca3af', marginBottom:8, fontWeight:'700' },
  langBtn:{ backgroundColor:'#2E7D32', paddingHorizontal:16, paddingVertical:10, borderRadius:12, borderWidth:1, borderColor:'#1f2937' },
  bigBtn:{ padding:14, borderRadius:14, alignItems:'center', borderWidth:1, borderColor:'#1f2937' }
});
