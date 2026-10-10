@MainActor
@Observable
final class TodosModel {
    private(set) var todos: [Todo] = []
    private(set) var error: String?
    private var fetchedAt: Date?
    private let api: TodoAPI

    init(api: TodoAPI) { self.api = api }

    func load(force: Bool = false) async {
        if !force, let fetchedAt, Date.now.timeIntervalSince(fetchedAt) < 30 { return } // staleTime
        do {
            todos = try await api.getTodos()
            fetchedAt = .now
            error = nil
        } catch {
            if !Task.isCancelled { self.error = "Couldn't refresh. Showing saved todos." }
        }
    }
}

struct TodoScreen: View {
    @State private var model = TodosModel(api: TodoAPI())

    var body: some View {
        List(model.todos) { Text($0.title) }
            .overlay { if let error = model.error { Text(error) } }
            .task { await model.load() }                  // on appear
            .refreshable { await model.load(force: true) } // pull to refresh
    }
}
