@MainActor
@Observable
final class TodosModel { // @link:model
    private(set) var todos: [Todo] = [] // @link:state
    private(set) var error: String? // @link:error
    private var fetchedAt: Date?
    private let api: TodoAPI

    init(api: TodoAPI) { self.api = api }

    func load(force: Bool = false) async { // @link:refresh
        if !force, let fetchedAt, Date.now.timeIntervalSince(fetchedAt) < 30 { return } // staleTime // @link:stale
        do {
            todos = try await api.getTodos() // @link:fetch
            fetchedAt = .now
            error = nil
        } catch {
            if !Task.isCancelled { self.error = "Couldn't refresh. Showing saved todos." } // @link:error
        }
    }
}

struct TodoScreen: View { // @link:screen
    @State private var model = TodosModel(api: TodoAPI()) // @link:model

    var body: some View {
        List(model.todos) { Text($0.title) } // @link:list
            .overlay { if let error = model.error { Text(error) } } // @link:error
            .task { await model.load() }                  // on appear // @link:load
            .refreshable { await model.load(force: true) } // pull to refresh // @link:refresh
    }
}
