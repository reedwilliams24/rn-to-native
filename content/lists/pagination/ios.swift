struct InfiniteList: View {
    let todos: [Todo]
    let loading: Bool
    let loadMore: () -> Void

    var body: some View {
        List {
            ForEach(todos) { todo in
                TodoRow(todo: todo)
            }
            if loading {
                ProgressView()
            } else {
                // A sentinel row. When it scrolls into view, ask for more.
                Color.clear
                    .frame(height: 1)
                    .onAppear(perform: loadMore)
            }
        }
    }
}
