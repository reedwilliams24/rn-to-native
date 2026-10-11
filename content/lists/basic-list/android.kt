@Composable
fun TodoList(todos: List<Todo>) { // @link:fn
    if (todos.isEmpty()) { // @link:empty
        Text("Nothing to do") // ListEmptyComponent is just an if // @link:empty
        return
    }
    LazyColumn { // @link:list
        items(todos, key = { it.id }) { todo -> // @link:items,key
            TodoRow(todo) // @link:row
            HorizontalDivider() // @link:sep
        }
    }
}
