const val MAX_TODOS = 100 // compile-time constant

fun main() {
    val name = "Reed" // read-only, like const
    var count = 0 // mutable, like let
    count += 1

    val todos = mutableListOf<String>()
    // val doesn't freeze the list either
    todos.add("Buy milk")

    val total: Int = 42 // type after the name
    val ratio = total / 5 // 8: integer division
    val exact = total / 5.0 // 8.4: now a Double
}
