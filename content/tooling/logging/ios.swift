import OSLog // @link:logger

private let logger = Logger( // @link:logger
    subsystem: "com.example.todo",
    category: "TodoRepository"
)

final class TodoRepository {
    private let api: TodoAPI
    init(api: TodoAPI) { self.api = api }

    func refresh() async { // @link:fn
        do { // @link:try
            let todos = try await api.fetchTodos() // @link:fetch
            logger.debug("Loaded \(todos.count) todos") // @link:debug
        } catch { // @link:catch
            let message = error.localizedDescription
            logger.error("Sync failed: \(message, privacy: .public)") // @link:error
        }
    }
}
