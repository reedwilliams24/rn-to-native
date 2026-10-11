struct TodoScreen: View { // @link:screen
    // @State owns the store for as long as this view is on screen
    @State private var store = TodoStore() // @link:read

    var body: some View {
        TodoList(todos: store.todos, onToggle: store.toggle) // @link:pass
    }
}

struct TodoList: View { // @link:list
    let todos: [Todo] // @link:list
    let onToggle: (Todo.ID) -> Void // @link:list

    var body: some View {
        List(todos) { todo in // @link:lazy
            TodoRow(title: todo.title, done: todo.done) { // @link:row
                onToggle(todo.id) // @link:row
            }
        }
    }
}
