val todos = listOf( // read-only List<Todo>
    Todo("1", "Buy milk", done = true),
    Todo("2", "Book flights", done = false),
)

val open = todos.filter { !it.done }.map { it.title }
val doneCount = todos.count { it.done }
val score = todos.fold(0) { n, t -> n + if (t.done) 1 else 0 }
val byId = todos.associateBy { it.id } // Map<String, Todo>

// Todo?
val firstB = todos.firstOrNull { it.title.startsWith("B") }

// Returns a new list; todos is untouched
val sorted = todos.sortedBy { it.title }
