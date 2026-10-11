// A class: reference type // @link:ref
class Counter(var count: Int = 0) // @link:counter

// Also a reference type, kept safe by immutability
data class Todo(val title: String, val done: Boolean = false) // @link:todo-type

fun main() {
    val a = Counter() // @link:a
    val b = a // @link:b
    b.count += 1 // @link:mut
    println(a.count) // 1: same object, like JS // @link:print

    val t1 = Todo("Buy milk") // @link:t1
    val t2 = t1.copy(done = true) // a new object // @link:t2
    println(t1.done) // false // @link:print2
}
