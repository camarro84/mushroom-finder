import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function DangerScreen() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('danger.title')}</Text>
      <Text style={styles.text}>Amanita phalloides (Death cap), Amanita muscaria, Galerina marginata, etc.</Text>
      <Text style={[styles.text,{marginTop:8}]}>Next: detect region by locale/GPS and show localized dangerous lookalikes.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0A0A0A', padding:16, justifyContent:'center' },
  title:{ color:'#fff', fontSize:20, fontWeight:'800', marginBottom:12, textAlign:'center' },
  text:{ color:'#d1d5db', textAlign:'center' }
});
