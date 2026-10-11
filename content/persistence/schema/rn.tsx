const db = SQLite.openDatabaseSync('app.db'); // @link:open

db.execSync(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
`); // @link:table

type TodoRow = { id: number; title: string; done: 0 | 1; created_at: number }; // @link:entity

const listTodos = () => // @link:select
  db.getAllAsync<TodoRow>('SELECT * FROM todos ORDER BY created_at DESC'); // @link:select

const addTodo = (title: string) => // @link:insert
  db.runAsync('INSERT INTO todos (title, created_at) VALUES (?, ?)', title, Date.now()); // @link:insert
