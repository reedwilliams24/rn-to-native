fun greet(name: String, greeting: String = "Hello"): String { // @link:greet
    return "$greeting, $name!" // @link:body
}

// Expression body: return type inferred
fun shout(s: String) = s.uppercase() // @link:shout

// Named arguments replace the options object
fun send( // @link:send
    message: String, // @link:msg
    to: String, // @link:to
    silent: Boolean = false, // @link:silent
) {
    val flag = if (silent) " (silent)" else "" // @link:flag
    println("$message → $to$flag") // @link:print
}

fun main() {
    greet("Reed") // @link:call1
    greet("Reed", greeting = "Hi") // @link:call2
    send("Lunch?", to = "Sam", silent = true) // @link:call3
}
