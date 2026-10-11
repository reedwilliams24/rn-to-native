struct TodoSummary: View { // @link:fn
    let todos: [Todo] // @link:props
    let query: String // @link:props

    // Computed properties re-run with body. That's fine for cheap work.
    private var visible: [Todo] { // @link:memo
        query.isEmpty ? todos : todos.filter { $0.title.localizedStandardContains(query) } // @link:filter
    }

    private var remaining: Int { todos.filter { !$0.done }.count } // @link:remaining

    var body: some View { // @link:body
        Text("\(visible.count) shown · \(remaining) left") // @link:text
    }
}
