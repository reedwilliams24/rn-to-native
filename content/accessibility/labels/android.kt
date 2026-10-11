@Composable
fun DeleteButton(onDelete: () -> Unit) { // @link:fn
    // IconButton: Role.Button and a 48dp touch target by default // @link:role,target
    IconButton( // @link:button
        onClick = onDelete, // @link:click
        modifier = Modifier.semantics {
            // TalkBack: "Double-tap to remove from your list"
            onClick(label = "remove from your list", action = null) // @link:hint
        },
    ) {
        Icon(Icons.Filled.Delete, contentDescription = "Delete todo") // @link:icon,label
    }
}

// Purely decorative images opt out with contentDescription = null // @link:decorative
