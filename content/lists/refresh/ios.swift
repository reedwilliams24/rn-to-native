struct Feed: View {
    let todos: [Todo]
    let reload: () async -> Void

    var body: some View {
        List(todos) { todo in
            TodoRow(todo: todo)
        }
        // The spinner shows until reload() returns. No refreshing state needed.
        .refreshable { await reload() }
    }
}
