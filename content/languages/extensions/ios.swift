struct Todo {
    var title: String
    var done: Bool
    var dueDate: Date
}

extension String {
    var capitalizedFirst: String {
        prefix(1).uppercased() + dropFirst()
    }
}

extension Todo {
    var isOverdue: Bool { !done && dueDate < .now }
}

let label = "milk".capitalizedFirst // "Milk"
let late = todos.filter(\.isOverdue)
