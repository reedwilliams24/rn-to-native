struct TodoListView: View { // @link:screen
    @Environment(\.modelContext) private var context // @link:model
    // A live query: the view updates whenever matching rows change
    @Query(sort: \Todo.createdAt, order: .reverse) private var todos: [Todo] // @link:query,todos

    var body: some View {
        List { // @link:list
            ForEach(todos) { todo in // @link:list
                TodoRow(title: todo.title, done: todo.done) { // @link:row
                    todo.done.toggle() // a @Model is a class: mutate it in place // @link:toggle
                }
            }
            Button("Add") { context.insert(Todo(title: "New todo")) } // @link:addbtn,add
        }
        // SwiftData autosaves the context; call context.save() to force it // @link:reload
    }
}
