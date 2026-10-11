const val MAX_TODOS = 100 // compile-time constant // @link:maxconst

fun main() {
    val name = "Reed" // read-only, like const // @link:const
    var count = 0 // mutable, like let // @link:var
    count += 1 // @link:inc

    val todos = mutableListOf<String>() // @link:list
    // val doesn't freeze the list either
    todos.add("Buy milk") // @link:add

    val total: Int = 42 // type after the name // @link:total
    val ratio = total / 5 // 8: integer division // @link:ratio
    val exact = total / 5.0 // 8.4: now a Double // @link:exact
}
