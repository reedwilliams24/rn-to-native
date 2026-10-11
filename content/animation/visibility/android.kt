@Composable
fun ErrorBanner(message: String?) { // @link:fn
    AnimatedVisibility( // @link:visible
        visible = message != null, // @link:visible
        enter = fadeIn() + expandVertically(), // @link:enter
        exit = fadeOut() + shrinkVertically(), // @link:exit
    ) {
        // Keep showing the last message while the exit animation runs
        val lastMessage = remember { mutableStateOf("") }
        if (message != null) lastMessage.value = message

        Surface(color = MaterialTheme.colorScheme.errorContainer) { // @link:banner
            Text(lastMessage.value, modifier = Modifier.padding(16.dp)) // @link:text
        }
    }
}
