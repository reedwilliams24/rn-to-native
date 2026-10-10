@Composable
fun Profile(userId: String) {
    var user by remember { mutableStateOf<User?>(null) }

    // Runs when Profile enters the composition, and again whenever userId
    // changes. The previous coroutine is cancelled first.
    LaunchedEffect(userId) {
        user = fetchUser(userId)
    }

    val current = user // a local val can be smart-cast; a delegated var can't
    if (current != null) Text(current.name) else CircularProgressIndicator()
}
