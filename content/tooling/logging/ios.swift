import OSLog

private let logger = Logger(
    subsystem: "com.example.todo",
    category: "TodoRepository"
)

final class TodoRepository {
    private let api: TodoAPI
    init(api: TodoAPI) { self.api = api }

    func refresh() async {
        do {
            let todos = try await api.fetchTodos()
            logger.debug("Loaded \(todos.count) todos")
        } catch {
            let message = error.localizedDescription
            logger.error("Sync failed: \(message, privacy: .public)")
        }
    }
}
