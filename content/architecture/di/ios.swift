protocol TodoRepository: Sendable {
    func list() async throws -> [Todo]
}

@MainActor
@Observable
final class TodoStore {
    private let repo: any TodoRepository
    private(set) var todos: [Todo] = []

    init(repo: any TodoRepository) { self.repo = repo }

    func load() async {
        todos = (try? await repo.list()) ?? []
    }
}

// The composition root builds the graph by hand and injects it
@main
struct TodoApp: App {
    @State private var store = TodoStore(repo: HTTPTodoRepository())

    var body: some Scene {
        WindowGroup {
            TodoScreen().environment(store)
        }
    }
}

struct TodoScreen: View {
    @Environment(TodoStore.self) private var store

    var body: some View {
        List(store.todos) { Text($0.title) }
            .task { await store.load() }
    }
}

#Preview {
    TodoScreen().environment(TodoStore(repo: FakeTodoRepository()))
}
