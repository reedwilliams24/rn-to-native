struct Feed: View { // @link:fn
    let todos: [Todo]
    let reload: () async -> Void // @link:fn

    var body: some View {
        List(todos) { todo in // @link:list,items
            TodoRow(todo: todo) // @link:items
        }
        // The spinner shows until reload() returns. No refreshing state needed.
        .refreshable { await reload() } // @link:bind,handler,reload
    }
}
