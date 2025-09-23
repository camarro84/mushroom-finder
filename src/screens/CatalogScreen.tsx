import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import data from '../data/mushrooms.sample.json';
import { useTranslation } from 'react-i18next';

type Item = { id:number; name:string; common:string; edible:boolean; notes:string; };

export default function CatalogScreen() {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const filtered = useMemo(()=> {
    const s = q.trim().toLowerCase();
    if (!s) return data as Item[];
    return (data as Item[]).filter(x => x.name.toLowerCase().includes(s) || x.common.toLowerCase().includes(s));
  }, [q]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('catalog.title')}</Text>
      <TextInput
        placeholder={t('catalog.search')}
        placeholderTextColor="#9ca3af"
        value={q} onChangeText={setQ}
        style={styles.input}
      />
      <FlatList
        data={filtered}
        keyExtractor={x=>String(x.id)}
        ItemSeparatorComponent={()=> <View style={{height:8}}/>}
        renderItem={({item})=>(
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.common} {item.edible ? '✅' : '☠️'}</Text>
            <Text style={styles.cardSub}>{item.name}</Text>
            <Text style={styles.cardText}>{item.notes}</Text>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0A0A0A', padding:16, paddingTop:6 },
  title:{ color:'#fff', fontSize:20, fontWeight:'800', marginBottom:8, textAlign:'center' },
  input:{ backgroundColor:'#0f172a', color:'#fff', padding:12, borderRadius:12, borderWidth:1, borderColor:'#1f2937', marginBottom:10 },
  card:{ backgroundColor:'#0B0B0B', borderRadius:14, padding:12, borderWidth:1, borderColor:'#1f2937' },
  cardTitle:{ color:'#fff', fontWeight:'800' },
  cardSub:{ color:'#93c5fd', fontSize:12, marginBottom:6 },
  cardText:{ color:'#d1d5db' }
});
