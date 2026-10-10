fun greet(name: String, greeting: String = "Hello"): String {
    return "$greeting, $name!"
}

// Expression body: return type inferred
fun shout(s: String) = s.uppercase()

// Named arguments replace the options object
fun send(
    message: String,
    to: String,
    silent: Boolean = false,
) {
    val flag = if (silent) " (silent)" else ""
    println("$message → $to$flag")
}

fun main() {
    greet("Reed")
    greet("Reed", greeting = "Hi")
    send("Lunch?", to = "Sam", silent = true)
}
