@Composable
fun TodoRow(title: String, onDelete: () -> Unit, onPin: () -> Unit) { // @link:fn
    Row(
        Modifier
            .fillMaxWidth()
            .padding(16.dp)
            // Swipes are invisible to TalkBack; expose them as actions // @link:swipe
            .semantics(mergeDescendants = true) { // @link:actions
                customActions = listOf( // @link:actions
                    CustomAccessibilityAction("Delete") { onDelete(); true }, // @link:delete
                    CustomAccessibilityAction("Pin") { onPin(); true }, // @link:pin
                )
            },
    ) {
        Text(title) // @link:title
    }
}
