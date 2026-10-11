export async function refreshTodos(api: TodoApi) { // @link:fn
  try { // @link:try
    const todos = await api.fetchTodos(); // @link:fetch
    console.log(`Loaded ${todos.length} todos`); // @link:debug
  } catch (e) { // @link:catch
    console.error('Sync failed', e); // @link:error
  }
}
