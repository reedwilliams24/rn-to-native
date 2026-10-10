struct TodoListView: View {
    @Environment(\.modelContext) private var context
    // A live query: the view updates whenever matching rows change
    @Query(sort: \Todo.createdAt, order: .reverse) private var todos: [Todo]

    var body: some View {
        List {
            ForEach(todos) { todo in
                TodoRow(title: todo.title, done: todo.done) {
                    todo.done.toggle() // a @Model is a class: mutate it in place
                }
            }
            Button("Add") { context.insert(Todo(title: "New todo")) }
        }
        // SwiftData autosaves the context; call context.save() to force it
    }
}
