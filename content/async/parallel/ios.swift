struct DashboardLoader { // @link:loader
    let api: API

    func loadDashboard() async throws -> Dashboard { // @link:dash
        // Both requests start immediately; `await` collects the results
        async let user = api.getUser() // @link:user
        async let todos = api.getTodos() // @link:todos
        return try await Dashboard(user: user, todos: todos) // @link:await,result
    }

    func loadTodos(ids: [String]) async throws -> [Todo] { // @link:many
        try await withThrowingTaskGroup(of: Todo.self) { group in // @link:fanout
            for id in ids {
                group.addTask { try await api.getTodo(id) } // @link:fanout
            }
            // Results arrive in completion order, not in `ids` order
            return try await group.reduce(into: []) { $0.append($1) } // @link:collect
        }
    }
}
