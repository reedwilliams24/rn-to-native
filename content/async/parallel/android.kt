class DashboardLoader(private val api: Api) { // @link:loader
    // coroutineScope waits for every child and cancels the rest if one fails
    suspend fun loadDashboard(): Dashboard = coroutineScope { // @link:dash
        val user = async { api.getUser() } // @link:user
        val todos = async { api.getTodos() } // @link:todos
        Dashboard(user.await(), todos.await()) // @link:await,result
    }

    suspend fun loadTodos(ids: List<String>): List<Todo> = coroutineScope { // @link:many
        ids.map { id -> async { api.getTodo(id) } }.awaitAll() // @link:fanout,collect
    }
}
