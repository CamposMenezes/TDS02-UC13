import * as SQLite from 'expo-sqlite';

let database;

export async function getDatabase() {
  if (!database) {
    database = await SQLite.openDatabaseAsync('taskflow.db');
    await database.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        priority TEXT NOT NULL DEFAULT 'Média',
        done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1)),
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_tasks_done ON tasks(done);
      CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
    `);
  }
  return database;
}
