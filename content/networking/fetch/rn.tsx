const BASE_URL = 'https://api.example.com'; // @link:base

async function getTodos(): Promise<Todo[]> { // @link:get
  const res = await fetch(`${BASE_URL}/todos`); // @link:get-req
  if (!res.ok) throw new Error(`HTTP ${res.status}`); // @link:check
  return parseTodos(await res.json()); // @link:decode
}

async function createTodo(input: NewTodo): Promise<Todo> { // @link:create
  const res = await fetch(`${BASE_URL}/todos`, { // @link:create-req
    method: 'POST', // @link:post
    headers: { 'Content-Type': 'application/json' }, // @link:ctype
    body: JSON.stringify(input), // @link:body
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`); // @link:check
  return res.json(); // @link:decode
}
