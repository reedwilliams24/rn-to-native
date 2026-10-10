const db = SQLite.openDatabaseSync('app.db');

db.execSync(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
`);

type TodoRow = { id: number; title: string; done: 0 | 1; created_at: number };

const listTodos = () =>
  db.getAllAsync<TodoRow>('SELECT * FROM todos ORDER BY created_at DESC');

const addTodo = (title: string) =>
  db.runAsync('INSERT INTO todos (title, created_at) VALUES (?, ?)', title, Date.now());
