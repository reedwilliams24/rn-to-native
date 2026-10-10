struct TodoListWithTop: View {
    let todos: [Todo]

    var body: some View {
        ScrollViewReader { proxy in // proxy is the "ref"
            List(todos) { todo in
                TodoRow(todo: todo)
            }
            .overlay(alignment: .bottomTrailing) {
                Button("Back to top", systemImage: "arrow.up") {
                    guard let first = todos.first else { return }
                    withAnimation { proxy.scrollTo(first.id, anchor: .top) }
                }
                .labelStyle(.iconOnly)
                .buttonStyle(.borderedProminent)
                .padding()
            }
        }
    }
}
