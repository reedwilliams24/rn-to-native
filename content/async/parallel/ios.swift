struct DashboardLoader {
    let api: API

    func loadDashboard() async throws -> Dashboard {
        // Both requests start immediately; `await` collects the results
        async let user = api.getUser()
        async let todos = api.getTodos()
        return try await Dashboard(user: user, todos: todos)
    }

    func loadTodos(ids: [String]) async throws -> [Todo] {
        try await withThrowingTaskGroup(of: Todo.self) { group in
            for id in ids {
                group.addTask { try await api.getTodo(id) }
            }
            // Results arrive in completion order, not in `ids` order
            return try await group.reduce(into: []) { $0.append($1) }
        }
    }
}
