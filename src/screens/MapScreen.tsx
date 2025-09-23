import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import MapView, { Marker, Region, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { addSpot, listSpots, removeSpot, Spot } from '../db/spots';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../storage/keys';
import { useTranslation } from 'react-i18next';

type Cluster = { key: string; lat: number; lng: number; count: number };

export default function MapScreen() {
  const { t } = useTranslation();
  const [region, setRegion] = useState<Region | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [showSpots, setShowSpots] = useState<boolean>(true);
  const [adding, setAdding] = useState<{ visible: boolean; coord?: LatLng }>({ visible: false });
  const [title, setTitle] = useState('');
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const vis = await AsyncStorage.getItem(STORAGE_KEYS.SPOTS_VISIBLE);
      setShowSpots(vis !== 'false');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setRegion({ latitude: 52.2297, longitude: 21.0122, latitudeDelta: 0.5, longitudeDelta: 0.5 }); // Warsaw fallback
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.08, longitudeDelta: 0.08 });
    })();
  }, []);

  const reload = useCallback(async () => setSpots(await listSpots()), []);
  useEffect(() => { reload(); }, [reload]);

  const onLongPress = useCallback(async (e: any) => {
    const { coordinate } = e.nativeEvent;
    setAdding({ visible: true, coord: coordinate });
    setTitle('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(()=>{});
  }, []);

  const saveSpot = useCallback(async () => {
    if (!adding.coord) return;
    const t = title?.trim() || 'Spot';
    await addSpot(t, adding.coord.latitude, adding.coord.longitude);
    setAdding({ visible: false });
    setTitle('');
    reload();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(()=>{});
  }, [adding, title, reload]);

  const remove = useCallback((id: number) => {
    Alert.alert('Remove spot', 'Are you sure?', [
      { text: 'Cancel', style:'cancel' },
      { text: 'Remove', style:'destructive', onPress: async () => { await removeSpot(id); reload(); } }
    ]);
  }, [reload]);

  const clusters = useMemo<Cluster[]>(() => {
    if (!region) return [];
    const zoomedOut = region.latitudeDelta > 0.2 || region.longitudeDelta > 0.2;
    if (!zoomedOut) return [];
    const cell = 0.05 * Math.max(region.latitudeDelta, region.longitudeDelta);
    const map = new Map<string, Cluster>();
    for (const s of spots) {
      const key = `${Math.round(s.lat/cell)}_${Math.round(s.lng/cell)}`;
      const c = map.get(key);
      if (c) { c.count += 1; }
      else { map.set(key, { key, lat: s.lat, lng: s.lng, count: 1 }); }
    }
    return Array.from(map.values());
  }, [spots, region]);

  const showIndividualSpots = useMemo(() => {
    if (!region) return false;
    return (region.latitudeDelta <= 0.2 && region.longitudeDelta <= 0.2);
  }, [region]);

  return (
    <View style={{ flex:1, backgroundColor:'#0A0A0A' }}>
      {region && (
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          onRegionChangeComplete={setRegion}
          onLongPress={onLongPress}
          showsUserLocation
        >
          {showSpots && showIndividualSpots && spots.map(s => (
            <Marker key={s.id} coordinate={{ latitude: s.lat, longitude: s.lng }} title={s.title} />
          ))}

          {showSpots && !showIndividualSpots && clusters.map(c => (
            <Marker key={c.key} coordinate={{ latitude: c.lat, longitude: c.lng }}>
              <View style={styles.cluster}><Text style={styles.clusterText}>{c.count}</Text></View>
            </Marker>
          ))}
        </MapView>
      )}

      <View style={styles.topBar}>
        <TouchableOpacity onPress={()=>setListOpen(true)} style={styles.topBtn}>
          <Ionicons name="list-outline" size={18} color="#fff" />
          <Text style={styles.topBtnText}>{t('map.searchSpots')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={async ()=>{
          const next = !showSpots;
          setShowSpots(next);
          await AsyncStorage.setItem(STORAGE_KEYS.SPOTS_VISIBLE, String(next));
        }} style={styles.topBtn}>
          <Ionicons name={showSpots?'eye-off-outline':'eye-outline'} size={18} color="#fff" />
          <Text style={styles.topBtnText}>{showSpots ? t('map.hideSpots') : t('map.showSpots')}</Text>
        </TouchableOpacity>
      </View>

      {showSpots && !showIndividualSpots && (
        <View style={styles.hint}><Text style={styles.hintText}>{t('map.zoomInToSee')}</Text></View>
      )}

      <Modal visible={adding.visible} transparent animationType="fade" onRequestClose={()=>setAdding({visible:false})}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('map.addSpot')}</Text>
            <TextInput
              placeholder="Name..."
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <View style={{ flexDirection:'row', gap:10 }}>
              <TouchableOpacity onPress={()=>setAdding({visible:false})} style={[styles.modalBtn, {backgroundColor:'#111827'}]}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveSpot} style={[styles.modalBtn, {backgroundColor:'#2E7D32'}]}>
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={listOpen} transparent animationType="slide" onRequestClose={()=>setListOpen(false)}>
        <View style={[styles.modalBg, {justifyContent:'flex-end'}]}>
          <View style={[styles.modalCard, {width:'100%', borderBottomLeftRadius:0, borderBottomRightRadius:0}]}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
              <Text style={styles.modalTitle}>{t('map.searchSpots')}</Text>
              <TouchableOpacity onPress={()=>setListOpen(false)}><Ionicons name="close" size={22} color="#fff" /></TouchableOpacity>
            </View>
            <FlatList
              data={spots}
              keyExtractor={s=>String(s.id)}
              ItemSeparatorComponent={()=> <View style={{height:8}}/>}
              renderItem={({item}) => (
                <View style={styles.spotRow}>
                  <View style={{flex:1}}>
                    <Text style={{color:'#fff', fontWeight:'700'}}>{item.title}</Text>
                    <Text style={{color:'#9ca3af', fontSize:12}}>{item.lat.toFixed(5)}, {item.lng.toFixed(5)}</Text>
                  </View>
                  <TouchableOpacity onPress={()=>{ setListOpen(false); }} style={styles.goBtn}>
                    <Ionicons name="locate-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>remove(item.id)} style={[styles.goBtn,{backgroundColor:'#B00020'}]}>
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cluster:{ backgroundColor:'#111827', paddingHorizontal:10, paddingVertical:6, borderRadius:16, borderWidth:1, borderColor:'#1f2937' },
  clusterText:{ color:'#fff', fontWeight:'800' },
  topBar:{ position:'absolute', top:20, left:12, right:12, flexDirection:'row', gap:8, justifyContent:'space-between' },
  topBtn:{ flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#111827', paddingHorizontal:12, paddingVertical:8, borderRadius:12, borderWidth:1, borderColor:'#1f2937' },
  topBtnText:{ color:'#fff', fontWeight:'700' },
  hint:{ position:'absolute', bottom:20, alignSelf:'center', backgroundColor:'#111827', paddingHorizontal:12, paddingVertical:8, borderRadius:12, borderWidth:1, borderColor:'#1f2937' },
  hintText:{ color:'#d1d5db' },

  modalBg:{ flex:1, backgroundColor:'rgba(0,0,0,0.6)', alignItems:'center', justifyContent:'center' },
  modalCard:{ backgroundColor:'#0B0B0B', borderRadius:16, padding:16, width:'92%', borderWidth:1, borderColor:'#1f2937' },
  modalTitle:{ color:'#fff', fontSize:18, fontWeight:'800', marginBottom:10 },
  input:{ backgroundColor:'#0f172a', color:'#fff', padding:12, borderRadius:12, borderWidth:1, borderColor:'#1f2937', marginBottom:12 },

  modalBtn:{ flex:1, alignItems:'center', justifyContent:'center', paddingVertical:12, borderRadius:12, borderWidth:1, borderColor:'#1f2937' },
  modalBtnText:{ color:'#fff', fontWeight:'700' },

  spotRow:{ flexDirection:'row', alignItems:'center', gap:8, backgroundColor:'#0B0B0B', padding:12, borderRadius:12, borderWidth:1, borderColor:'#1f2937' },
  goBtn:{ paddingHorizontal:12, paddingVertical:10, borderRadius:10, backgroundColor:'#2E7D32', borderWidth:1, borderColor:'#1f2937', marginLeft:6 }
});
