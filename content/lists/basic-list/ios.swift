struct TodoList: View {
    let todos: [Todo] // Todo: Identifiable

    var body: some View {
        List(todos) { todo in
            TodoRow(todo: todo) // separators are drawn for you
        }
        .overlay {
            if todos.isEmpty {
                ContentUnavailableView("Nothing to do", systemImage: "checkmark.circle")
            }
        }
    }
}
