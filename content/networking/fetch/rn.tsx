const BASE_URL = 'https://api.example.com';

async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${BASE_URL}/todos`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parseTodos(await res.json());
}

async function createTodo(input: NewTodo): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
