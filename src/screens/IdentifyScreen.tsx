import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';

export default function IdentifyScreen() {
  const { t } = useTranslation();
  const [uri, setUri] = useState<string | null>(null);

  const pick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.9, allowsEditing: true });
    if (!res.canceled) setUri(res.assets[0].uri);
  };

  const camera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchCameraAsync({ quality: 0.9 });
    if (!res.canceled) setUri(res.assets[0].uri);
  };

  const identify = () => {
    Alert.alert(t('identify.title'), 'Coming soon: on-device or cloud recognition.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('identify.title')}</Text>
      {uri ? <Image source={{ uri }} style={styles.preview} /> : <Text style={styles.hint}>{t('identify.hint')}</Text>}
      <View style={{ height: 12 }} />
      <Button label={t('identify.pick')} onPress={pick} />
      <View style={{ height: 8 }} />
      <Button variant="secondary" label={t('identify.camera')} onPress={camera} />
      <View style={{ height: 12 }} />
      <Button label={t('identify.identify')} onPress={identify} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0A0A0A', padding:16 },
  title:{ color:'#fff', fontSize:20, fontWeight:'800', textAlign:'center', marginBottom:12 },
  hint:{ color:'#9ca3af', textAlign:'center' },
  preview:{ width:'100%', aspectRatio:1, borderRadius:12, borderWidth:1, borderColor:'#1f2937' }
});
