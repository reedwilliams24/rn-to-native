struct Todo: Identifiable {
    let id = UUID()
    var title: String
    var done = false
}

@MainActor
@Observable
final class TodoStore {
    // Readable by views, writable only through the methods below
    private(set) var todos: [Todo] = []

    func add(_ title: String) {
        todos.append(Todo(title: title))
    }

    func toggle(_ id: Todo.ID) {
        guard let i = todos.firstIndex(where: { $0.id == id }) else { return }
        todos[i].done.toggle()
    }
}
