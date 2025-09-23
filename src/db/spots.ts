import * as SQLite from 'expo-sqlite';

export type Spot = { id: number; title: string; lat: number; lng: number; createdAt: number; };

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDb() {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('spots.db');
  await _db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS spots (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      title TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      createdAt INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_spots_time ON spots(createdAt DESC);
  `);
  return _db;
}
export async function listSpots() {
  const db = await getDb();
  return db.getAllAsync<Spot>('SELECT * FROM spots ORDER BY createdAt DESC;');
}
export async function addSpot(title: string, lat: number, lng: number) {
  const db = await getDb();
  const createdAt = Date.now();
  const res = await db.runAsync('INSERT INTO spots (title, lat, lng, createdAt) VALUES (?, ?, ?, ?);', [title, lat, lng, createdAt]);
  return res.lastInsertRowId as number;
}
export async function removeSpot(id: number) {
  const db = await getDb();
  await db.runAsync('DELETE FROM spots WHERE id = ?;', [id]);
}
