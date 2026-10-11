struct Todo: /*[*/Identifiable/*]*/ {
    let id: String
    let title: String
}

struct TodoList: View {
    let todos: [Todo]

    var body: some View {
        /*[*/List/*]*/(todos) { /*[*/todo in/*]*/
            Text(todo.title)
        }
    }
}
