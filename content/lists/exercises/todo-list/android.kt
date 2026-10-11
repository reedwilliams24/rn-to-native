data class Todo(val id: String, val title: String)

@Composable
fun TodoList(todos: List<Todo>) {
    /*[*/LazyColumn/*]*/ {
        /*[*/items/*]*/(todos, key = { /*[*/it.id/*]*/ }) { todo ->
            Text(
                todo.title,
                Modifier.padding(16.dp),
            )
        }
    }
}
