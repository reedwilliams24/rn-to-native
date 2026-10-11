struct Todo { // @link:type
    var title: String
    var done: Bool
    var dueDate: Date
}

extension String { // @link:cap
    var capitalizedFirst: String { // @link:cap
        prefix(1).uppercased() + dropFirst() // @link:capbody
    }
}

extension Todo { // @link:overdue
    var isOverdue: Bool { !done && dueDate < .now } // @link:overdue,overduebody
}

let label = "milk".capitalizedFirst // "Milk" // @link:uselabel
let late = todos.filter(\.isOverdue) // @link:uselate
