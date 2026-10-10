export async function refreshTodos(api: TodoApi) {
  try {
    const todos = await api.fetchTodos();
    console.log(`Loaded ${todos.length} todos`);
  } catch (e) {
    console.error('Sync failed', e);
  }
}
