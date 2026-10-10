struct Todo: Identifiable, Equatable {
    let id: UUID
    var title: String
    var done: Bool
}

struct TodoRow: View, Equatable {
    let todo: Todo
    let onToggle: (Todo.ID) -> Void

    // Closures can't be compared, so compare only the data
    static func == (lhs: Self, rhs: Self) -> Bool { lhs.todo == rhs.todo }

    var body: some View {
        Button { onToggle(todo.id) } label: {
            Label(todo.title, systemImage: todo.done ? "checkmark.circle.fill" : "circle")
        }
    }
}

// In the list: TodoRow(todo: todo, onToggle: toggle).equatable()
