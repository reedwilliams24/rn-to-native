@Composable
fun ErrorBanner(message: String?) {
    AnimatedVisibility(
        visible = message != null,
        enter = fadeIn() + expandVertically(),
        exit = fadeOut() + shrinkVertically(),
    ) {
        // Keep showing the last message while the exit animation runs
        val lastMessage = remember { mutableStateOf("") }
        if (message != null) lastMessage.value = message

        Surface(color = MaterialTheme.colorScheme.errorContainer) {
            Text(lastMessage.value, modifier = Modifier.padding(16.dp))
        }
    }
}
