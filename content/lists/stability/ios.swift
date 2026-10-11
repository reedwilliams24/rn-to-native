struct Todo: Identifiable, Equatable { // @link:model
    let id: UUID
    var title: String
    var done: Bool
}

struct TodoRow: View, Equatable { // @link:row,memo
    let todo: Todo
    let onToggle: (Todo.ID) -> Void // @link:callback

    // Closures can't be compared, so compare only the data
    static func == (lhs: Self, rhs: Self) -> Bool { lhs.todo == rhs.todo } // @link:memo

    var body: some View {
        Button { onToggle(todo.id) } label: { // @link:tap
            Label(todo.title, systemImage: todo.done ? "checkmark.circle.fill" : "circle") // @link:label
        }
    }
}

// In the list: TodoRow(todo: todo, onToggle: toggle).equatable() // @link:call,list
