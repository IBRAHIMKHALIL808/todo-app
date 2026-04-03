import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('todos.db');

export function initDatabase() {
  db.execSync(
    `CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0
    );`
  );
}

export function saveTodoSQL(id: string, text: string, completed: boolean) {
  db.runSync(
    `INSERT OR REPLACE INTO todos (id, text, completed) VALUES (?, ?, ?);`,
    [id, text, completed ? 1 : 0]
  );
}

export function deleteTodoSQL(id: string) {
  db.runSync(`DELETE FROM todos WHERE id = ?;`, [id]);
}

export function loadTodosSQL() {
  const rows = db.getAllSync(`SELECT * FROM todos ORDER BY id DESC;`);
  return rows.map((row: any) => ({
    id: row.id,
    text: row.text,
    completed: row.completed === 1,
  }));
}

export function clearCompletedSQL() {
  db.runSync(`DELETE FROM todos WHERE completed = 1;`);
}