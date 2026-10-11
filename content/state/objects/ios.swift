struct Todo: Identifiable { // @link:type
    let id = UUID()
    var title: String
    var done = false
}

struct Todos: View { // @link:fn
    @State private var todos: [Todo] = [] // @link:state

    var body: some View {
        VStack { // @link:container
            // $todos gives a Binding to each element
            ForEach($todos) { $todo in // @link:foreach
                Toggle(todo.title, isOn: $todo.done) // @link:row,item,toggle
            }
            // Arrays are values: mutating in place still counts as a new value
            Button("Add") { todos.append(Todo(title: "New todo")) } // @link:addbtn,add
        }
    }
}
