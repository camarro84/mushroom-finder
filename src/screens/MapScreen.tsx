// src/screens/MapScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, FlatList, Alert } from 'react-native';
import MapView, { Marker, Region, LongPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { addSpot, deleteSpot, getSpots, initSpots, Spot } from '../db/spots';

export default function MapScreen() {
  const [region, setRegion] = useState<Region | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [draft, setDraft] = useState<{ lat: number; lng: number; title: string; note: string } | null>(null);

  // init DB and location
  useEffect(() => {
    (async () => {
      await initSpots();

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location', 'Permission denied. Map will center on Warsaw.');
        setRegion({
          latitude: 52.2297,
          longitude: 21.0122,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        });
      } else {
        const pos = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }

      const list = await getSpots();
      setSpots(list);
    })();
  }, []);

  const openAddModalAt = useCallback((lat: number, lng: number) => {
    setDraft({ lat, lng, title: '', note: '' });
    setModalVisible(true);
  }, []);

  // ✅ правильный тип события для onLongPress
  const onLongPress = (e: LongPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    openAddModalAt(latitude, longitude);
  };

  const saveSpot = async () => {
    if (!draft) return;
    if (!draft.title.trim()) {
      Alert.alert('Validation', 'Please enter a title.');
      return;
    }
    await addSpot({
      title: draft.title.trim(),
      note: draft.note.trim(),
      lat: draft.lat,
      lng: draft.lng,
    });
    const updated = await getSpots();
    setSpots(updated);
    setModalVisible(false);
    setDraft(null);
  };

  const removeSpot = async (id?: number) => {
    if (!id) return;
    await deleteSpot(id);
    setSpots(await getSpots());
  };

  if (!region) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Loading map…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={region}
        showsUserLocation
        onLongPress={onLongPress}
      >
        {spots.map((s) => (
          <Marker
            key={s.id}
            coordinate={{ latitude: s.lat, longitude: s.lng }}
            title={s.title}
            description={s.note}
          />
        ))}
      </MapView>

      <View style={styles.card}>
        <Text style={styles.title}>Saved spots</Text>
        <FlatList
          data={spots}
          keyExtractor={(item) => String(item.id ?? `${item.lat}-${item.lng}`)}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.spotTitle}>{item.title}</Text>
                {!!item.note && <Text style={styles.spotNote}>{item.note}</Text>}
                <Text style={styles.coords}>
                  {item.lat.toFixed(5)}, {item.lng.toFixed(5)}
                </Text>
              </View>
              <Pressable onPress={() => removeSpot(item.id)} style={styles.deleteBtn}>
                <Text style={{ color: '#fff' }}>✕</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.text}>Long-press on the map to add a spot.</Text>}
        />
      </View>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modal}>
            <Text style={styles.title}>New mushroom spot</Text>
            <TextInput
              placeholder="Title"
              placeholderTextColor="#888"
              style={styles.input}
              value={draft?.title ?? ''}
              onChangeText={(t) => setDraft((d) => (d ? { ...d, title: t } : d))}
            />
            <TextInput
              placeholder="Note (optional)"
              placeholderTextColor="#888"
              style={[styles.input, { height: 80 }]}
              multiline
              value={draft?.note ?? ''}
              onChangeText={(t) => setDraft((d) => (d ? { ...d, note: t } : d))}
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable onPress={() => setModalVisible(false)} style={[styles.btn, { backgroundColor: '#333' }]}>
                <Text style={styles.btnText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={saveSpot} style={[styles.btn, { backgroundColor: '#2E7D32' }]}>
                <Text style={styles.btnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0C0C0C' },
  text: { color: '#ddd' },
  card: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#121212DD', padding: 12, maxHeight: 220 },
  title: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#222' },
  spotTitle: { color: '#fff', fontWeight: '700' },
  spotNote: { color: '#ccc' },
  coords: { color: '#888', fontSize: 12 },
  deleteBtn: { backgroundColor: '#B00020', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  modalWrap: { flex: 1, backgroundColor: '#0008', alignItems: 'center', justifyContent: 'center' },
  modal: { width: '90%', backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, gap: 10 },
  input: { backgroundColor: '#111', borderColor: '#333', borderWidth: 1, color: '#fff', borderRadius: 10, padding: 10 },
  btn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
