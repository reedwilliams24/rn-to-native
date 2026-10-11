data class Todo(val id: String, val title: String, val done: Boolean = false) // @link:type

@Composable
fun Todos() { // @link:fn
    // Holds an immutable List. Changing it means assigning a new list.
    var todos by remember { mutableStateOf(listOf<Todo>()) } // @link:state

    fun add(title: String) { // @link:add
        todos = todos + Todo(id = UUID.randomUUID().toString(), title = title) // @link:add
    }
    fun toggle(id: String) { // @link:toggle
        todos = todos.map { if (it.id == id) it.copy(done = !it.done) else it } // @link:toggle
    }

    Column { // @link:container
        todos.forEach { todo -> // @link:foreach
            Row(Modifier.clickable { toggle(todo.id) }) { // @link:row
                Checkbox(checked = todo.done, onCheckedChange = null) // @link:item
                Text(todo.title) // @link:item
            }
        }
        Button(onClick = { add("New todo") }) { Text("Add") } // @link:addbtn
    }
}
