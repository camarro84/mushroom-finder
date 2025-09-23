// src/db/spots.ts
import * as SQLite from 'expo-sqlite';

// новый async API
const dbPromise = SQLite.openDatabaseAsync('mushroom.db');

export type Spot = {
  id?: number;
  title: string;
  note?: string;
  lat: number;
  lng: number;
  created_at?: string;
};

export async function initSpots(): Promise<void> {
  const db = await dbPromise;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS spots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      note TEXT,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

export async function addSpot(spot: Spot): Promise<number> {
  const db = await dbPromise;
  const res = await db.runAsync(
    'INSERT INTO spots (title, note, lat, lng) VALUES (?,?,?,?)',
    [spot.title, spot.note ?? '', spot.lat, spot.lng]
  );
  return Number(res.lastInsertRowId);
}

export async function getSpots(): Promise<Spot[]> {
  const db = await dbPromise;
  const rows = await db.getAllAsync<Spot>(
    'SELECT id, title, note, lat, lng, created_at FROM spots ORDER BY id DESC'
  );
  return rows;
}

export async function deleteSpot(id: number): Promise<void> {
  const db = await dbPromise;
  await db.runAsync('DELETE FROM spots WHERE id = ?', [id]);
}
