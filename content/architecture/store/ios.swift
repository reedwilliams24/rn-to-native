struct Todo: Identifiable { // @link:model
    let id = UUID()
    var title: String
    var done = false
}

@MainActor
@Observable
final class TodoStore { // @link:store
    // Readable by views, writable only through the methods below
    private(set) var todos: [Todo] = [] // @link:todos

    func add(_ title: String) { // @link:add,add-sig
        todos.append(Todo(title: title)) // @link:add
    }

    func toggle(_ id: Todo.ID) { // @link:toggle,toggle-sig
        guard let i = todos.firstIndex(where: { $0.id == id }) else { return } // @link:toggle
        todos[i].done.toggle() // @link:toggle
    }
}
