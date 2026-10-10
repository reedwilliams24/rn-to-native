class DashboardLoader(private val api: Api) {
    // coroutineScope waits for every child and cancels the rest if one fails
    suspend fun loadDashboard(): Dashboard = coroutineScope {
        val user = async { api.getUser() }
        val todos = async { api.getTodos() }
        Dashboard(user.await(), todos.await())
    }

    suspend fun loadTodos(ids: List<String>): List<Todo> = coroutineScope {
        ids.map { id -> async { api.getTodo(id) } }.awaitAll()
    }
}
