@Composable
fun Profile(userId: String) { // @link:fn
    var user by remember { mutableStateOf<User?>(null) } // @link:state

    // Runs when Profile enters the composition, and again whenever userId
    // changes. The previous coroutine is cancelled first. // @link:cancel
    LaunchedEffect(userId) { // @link:effect
        user = fetchUser(userId) // @link:fetch,assign
    }

    val current = user // a local val can be smart-cast; a delegated var can't // @link:render
    if (current != null) Text(current.name) else CircularProgressIndicator() // @link:render,loading
}
