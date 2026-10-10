struct Todo: Identifiable {
    let id = UUID()
    var title: String
    var done = false
}

struct Todos: View {
    @State private var todos: [Todo] = []

    var body: some View {
        VStack {
            // $todos gives a Binding to each element
            ForEach($todos) { $todo in
                Toggle(todo.title, isOn: $todo.done)
            }
            // Arrays are values: mutating in place still counts as a new value
            Button("Add") { todos.append(Todo(title: "New todo")) }
        }
    }
}
