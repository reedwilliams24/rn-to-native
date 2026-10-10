struct TodoScreen: View {
    // @State owns the store for as long as this view is on screen
    @State private var store = TodoStore()

    var body: some View {
        TodoList(todos: store.todos, onToggle: store.toggle)
    }
}

struct TodoList: View {
    let todos: [Todo]
    let onToggle: (Todo.ID) -> Void

    var body: some View {
        List(todos) { todo in
            TodoRow(title: todo.title, done: todo.done) {
                onToggle(todo.id)
            }
        }
    }
}
