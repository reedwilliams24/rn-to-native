async function loadDashboard(): Promise<Dashboard> { // @link:dash
  const [user, todos] = await Promise.all([api.getUser(), api.getTodos()]); // @link:user,todos,await
  return { user, todos }; // @link:result
}

async function loadTodos(ids: string[]): Promise<Todo[]> { // @link:many
  return Promise.all(ids.map((id) => api.getTodo(id))); // @link:fanout,collect
}
