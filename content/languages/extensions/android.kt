data class Todo( // @link:type
    val title: String,
    val done: Boolean,
    val dueDate: LocalDate,
)

// Extension function on a type you don't own
fun String.capitalized(): String = // @link:cap
    replaceFirstChar { it.uppercase() } // @link:capbody

// Extension property: computed, no storage
val Todo.isOverdue: Boolean // @link:overdue
    get() = !done && dueDate < LocalDate.now() // @link:overduebody

fun example(todos: List<Todo>) {
    val label = "milk".capitalized() // "Milk" // @link:uselabel
    val late = todos.filter { it.isOverdue } // @link:uselate
}
