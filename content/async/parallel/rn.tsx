async function loadDashboard(): Promise<Dashboard> {
  const [user, todos] = await Promise.all([api.getUser(), api.getTodos()]);
  return { user, todos };
}

async function loadTodos(ids: string[]): Promise<Todo[]> {
  return Promise.all(ids.map((id) => api.getTodo(id)));
}
