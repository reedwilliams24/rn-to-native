enum Filter { case all, open }

enum TodoAction {
    case add(String)
    case toggle(Todo.ID)
    case setFilter(Filter)
}

@MainActor
@Observable
final class TodoStore {
    private(set) var todos: [Todo] = []
    private(set) var filter: Filter = .all

    var visible: [Todo] {
        filter == .open ? todos.filter { !$0.done } : todos
    }

    func send(_ action: TodoAction) {
        switch action {
        case .add(let title):
            todos.append(Todo(title: title))
        case .toggle(let id):
            if let i = todos.firstIndex(where: { $0.id == id }) { todos[i].done.toggle() }
        case .setFilter(let filter):
            self.filter = filter
        }
    }
}
