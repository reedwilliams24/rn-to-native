struct TodoSummary: View {
    let todos: [Todo]
    let query: String

    // Computed properties re-run with body. That's fine for cheap work.
    private var visible: [Todo] {
        query.isEmpty ? todos : todos.filter { $0.title.localizedStandardContains(query) }
    }

    private var remaining: Int { todos.filter { !$0.done }.count }

    var body: some View {
        Text("\(visible.count) shown · \(remaining) left")
    }
}
