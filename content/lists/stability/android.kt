// Only vals of stable types, so Compose treats Todo as stable
data class Todo(val id: String, val title: String, val done: Boolean) // @link:model

@Composable
fun TodoRow(todo: Todo, onToggle: (String) -> Unit) { // @link:row
    Row(Modifier.clickable { onToggle(todo.id) }.padding(16.dp)) { // @link:tap
        Checkbox(checked = todo.done, onCheckedChange = null) // @link:label
        Text(todo.title) // @link:label
    }
}

@Composable
fun TodoList(todos: List<Todo>, onToggle: (String) -> Unit) { // @link:list,callback
    LazyColumn { // @link:lazy
        items(todos, key = { it.id }) { todo -> // @link:lazy
            // No memo or useCallback. If todo and onToggle are equal to last // @link:memo,callback
            // time, this call is skipped automatically.
            TodoRow(todo, onToggle) // @link:call
        }
    }
}
