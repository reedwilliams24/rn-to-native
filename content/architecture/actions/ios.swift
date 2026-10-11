enum Filter { case all, open } // @link:filter

enum TodoAction { // @link:action
    case add(String) // @link:add
    case toggle(Todo.ID) // @link:toggle
    case setFilter(Filter) // @link:setfilter
}

@MainActor
@Observable
final class TodoStore {
    private(set) var todos: [Todo] = [] // @link:state
    private(set) var filter: Filter = .all // @link:state

    var visible: [Todo] { // @link:visible
        filter == .open ? todos.filter { !$0.done } : todos // @link:visible
    }

    func send(_ action: TodoAction) { // @link:reduce
        switch action { // @link:switch
        case .add(let title): // @link:add-case
            todos.append(Todo(title: title)) // @link:add-case
        case .toggle(let id): // @link:toggle-case
            if let i = todos.firstIndex(where: { $0.id == id }) { todos[i].done.toggle() } // @link:toggle-case
        case .setFilter(let filter): // @link:filter-case
            self.filter = filter // @link:filter-case
        }
    }
}
