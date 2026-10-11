let todos = [ // [Todo], immutable because of let // @link:list
    Todo(id: "1", title: "Buy milk", done: true), // @link:item1
    Todo(id: "2", title: "Book flights", done: false), // @link:item2
]

let open = todos.filter { !$0.done }.map(\.title) // @link:open
let doneCount = todos.filter(\.done).count // @link:count
let score = todos.reduce(0) { n, t in n + (t.done ? 1 : 0) } // @link:fold
let byId = Dictionary( // @link:byid
    uniqueKeysWithValues: todos.map { ($0.id, $0) } // @link:byid
)

// Todo? // @link:findtype
let firstB = todos.first { $0.title.hasPrefix("B") } // @link:find

// Returns a new array
let sorted = todos.sorted { $0.title < $1.title } // @link:sort
