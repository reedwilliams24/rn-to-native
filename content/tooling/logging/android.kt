private const val TAG = "TodoRepository"

class TodoRepository(private val api: TodoApi) {
    suspend fun refresh() {
        try {
            val todos = api.fetchTodos()
            Log.d(TAG, "Loaded ${todos.size} todos")
        } catch (e: IOException) {
            // The stack trace shows in Logcat
            Log.e(TAG, "Sync failed", e)
        }
    }
}
