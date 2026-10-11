struct TodoList: View { // @link:fn
    let todos: [Todo] // Todo: Identifiable // @link:fn,key

    var body: some View {
        List(todos) { todo in // @link:list,items
            TodoRow(todo: todo) // separators are drawn for you // @link:row,sep
        }
        .overlay { // @link:empty
            if todos.isEmpty { // @link:empty
                ContentUnavailableView("Nothing to do", systemImage: "checkmark.circle") // @link:empty
            }
        }
    }
}
