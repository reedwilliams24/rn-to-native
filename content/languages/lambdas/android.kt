val isDone: (Todo) -> Boolean = { todo -> todo.done }

fun measure(label: String, block: () -> Unit) {
    val start = System.currentTimeMillis()
    block()
    val ms = System.currentTimeMillis() - start
    println("$label: ${ms}ms")
}

fun example(todos: List<Todo>) {
    measure("filter") { // trailing lambda
        // `it` is the single parameter
        val open = todos.filter { !it.done }
        println(open.map { it.title })
    }

    var taps = 0
    val onTap = { taps += 1 } // captures taps
    onTap()
}
