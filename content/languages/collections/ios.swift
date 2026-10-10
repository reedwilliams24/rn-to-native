let todos = [ // [Todo], immutable because of let
    Todo(id: "1", title: "Buy milk", done: true),
    Todo(id: "2", title: "Book flights", done: false),
]

let open = todos.filter { !$0.done }.map(\.title)
let doneCount = todos.filter(\.done).count
let score = todos.reduce(0) { n, t in n + (t.done ? 1 : 0) }
let byId = Dictionary(
    uniqueKeysWithValues: todos.map { ($0.id, $0) }
)

// Todo?
let firstB = todos.first { $0.title.hasPrefix("B") }

// Returns a new array
let sorted = todos.sorted { $0.title < $1.title }
