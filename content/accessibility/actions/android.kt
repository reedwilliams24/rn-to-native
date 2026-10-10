@Composable
fun TodoRow(title: String, onDelete: () -> Unit, onPin: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(16.dp)
            // Swipes are invisible to TalkBack; expose them as actions
            .semantics(mergeDescendants = true) {
                customActions = listOf(
                    CustomAccessibilityAction("Delete") { onDelete(); true },
                    CustomAccessibilityAction("Pin") { onPin(); true },
                )
            },
    ) {
        Text(title)
    }
}
