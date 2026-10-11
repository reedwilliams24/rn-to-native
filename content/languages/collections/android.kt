val todos = listOf( // read-only List<Todo> // @link:list
    Todo("1", "Buy milk", done = true), // @link:item1
    Todo("2", "Book flights", done = false), // @link:item2
)

val open = todos.filter { !it.done }.map { it.title } // @link:open
val doneCount = todos.count { it.done } // @link:count
val score = todos.fold(0) { n, t -> n + if (t.done) 1 else 0 } // @link:fold
val byId = todos.associateBy { it.id } // Map<String, Todo> // @link:byid

// Todo? // @link:findtype
val firstB = todos.firstOrNull { it.title.startsWith("B") } // @link:find

// Returns a new list; todos is untouched
val sorted = todos.sortedBy { it.title } // @link:sort
