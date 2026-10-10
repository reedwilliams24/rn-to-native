@Composable
fun DeleteButton(onDelete: () -> Unit) {
    // IconButton: Role.Button and a 48dp touch target by default
    IconButton(
        onClick = onDelete,
        modifier = Modifier.semantics {
            // TalkBack: "Double-tap to remove from your list"
            onClick(label = "remove from your list", action = null)
        },
    ) {
        Icon(Icons.Filled.Delete, contentDescription = "Delete todo")
    }
}

// Purely decorative images opt out with contentDescription = null
