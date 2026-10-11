protocol TodoRepository: Sendable { // @link:iface
    func list() async throws -> [Todo] // @link:list
}

@MainActor
@Observable
final class TodoStore { // @link:consumer
    private let repo: any TodoRepository // @link:consumer
    private(set) var todos: [Todo] = []

    init(repo: any TodoRepository) { self.repo = repo } // @link:consumer

    func load() async {
        todos = (try? await repo.list()) ?? []
    }
}

// The composition root builds the graph by hand and injects it // @link:inject
@main
struct TodoApp: App {
    @State private var store = TodoStore(repo: HTTPTodoRepository()) // @link:bind,impl

    var body: some Scene {
        WindowGroup {
            TodoScreen().environment(store)
        }
    }
}

struct TodoScreen: View {
    @Environment(TodoStore.self) private var store // @link:resolve

    var body: some View {
        List(store.todos) { Text($0.title) }
            .task { await store.load() }
    }
}

#Preview {
    TodoScreen().environment(TodoStore(repo: FakeTodoRepository())) // @link:fake
}
