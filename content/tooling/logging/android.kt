private const val TAG = "TodoRepository" // @link:logger

class TodoRepository(private val api: TodoApi) {
    suspend fun refresh() { // @link:fn
        try { // @link:try
            val todos = api.fetchTodos() // @link:fetch
            Log.d(TAG, "Loaded ${todos.size} todos") // @link:debug
        } catch (e: IOException) { // @link:catch
            // The stack trace shows in Logcat
            Log.e(TAG, "Sync failed", e) // @link:error
        }
    }
}
