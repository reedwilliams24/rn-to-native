// A class: reference type
class Counter(var count: Int = 0)

// Also a reference type, kept safe by immutability
data class Todo(val title: String, val done: Boolean = false)

fun main() {
    val a = Counter()
    val b = a
    b.count += 1
    println(a.count) // 1: same object, like JS

    val t1 = Todo("Buy milk")
    val t2 = t1.copy(done = true) // a new object
    println(t1.done) // false
}
