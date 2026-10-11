val isDone: (Todo) -> Boolean = { todo -> todo.done } // @link:isdone

fun measure(label: String, block: () -> Unit) { // @link:measure
    val start = System.currentTimeMillis() // @link:start
    block() // @link:call
    val ms = System.currentTimeMillis() - start // @link:print
    println("$label: ${ms}ms") // @link:print
}

fun example(todos: List<Todo>) { // @link:example
    measure("filter") { // trailing lambda // @link:trailing
        // `it` is the single parameter
        val open = todos.filter { !it.done } // @link:filter
        println(open.map { it.title }) // @link:map
    }

    var taps = 0 // @link:taps
    val onTap = { taps += 1 } // captures taps // @link:ontap
    onTap() // @link:invoke
}
