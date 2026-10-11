data class Todo( // @link:type
    val id: String, // @link:id
    val title: String, // @link:title
    val done: Boolean = false, // @link:done
)

val todo = Todo(id = "1", title = "Buy milk") // @link:create
val finished = todo.copy(done = true) // the spread // @link:copy

// true: generated equals() compares fields
val same = finished == finished.copy() // @link:equals
// false: two different objects
val identical = finished === finished.copy() // @link:identity

fun main() {
    println(todo) // @link:print
    // Todo(id=1, title=Buy milk, done=false) // @link:out
}
