data class Todo(
    val id: String,
    val title: String,
    val done: Boolean = false,
)

val todo = Todo(id = "1", title = "Buy milk")
val finished = todo.copy(done = true) // the spread

// true: generated equals() compares fields
val same = finished == finished.copy()
// false: two different objects
val identical = finished === finished.copy()

fun main() {
    println(todo)
    // Todo(id=1, title=Buy milk, done=false)
}
