data class Todo(
    val title: String,
    val done: Boolean,
    val dueDate: LocalDate,
)

// Extension function on a type you don't own
fun String.capitalized(): String =
    replaceFirstChar { it.uppercase() }

// Extension property: computed, no storage
val Todo.isOverdue: Boolean
    get() = !done && dueDate < LocalDate.now()

fun example(todos: List<Todo>) {
    val label = "milk".capitalized() // "Milk"
    val late = todos.filter { it.isOverdue }
}
